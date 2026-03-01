/* Copyright 2026 Marimo. All rights reserved. */

import {
  CheckIcon,
  CopyIcon,
  Eye,
  EyeOff,
  KeyIcon,
  PlusIcon,
  RefreshCw,
  Trash2,
  Lock,
  FileText,
} from 'lucide-react';
import React from 'react';
import { Spinner } from '@/features/lab/components/icons/spinner';
import { useImperativeModal } from '@/features/lab/components/modal/ImperativeModal';
import { toast } from '@/features/lab/components/ui/use-toast';
import { SECRETS_REGISTRY } from '@/features/lab/core/secrets/request-registry';
import { useAsyncData } from '@/features/lab/hooks/useAsyncData';
import { ErrorBanner } from '@/features/lab/plugins/impl/common/error-banner';
import { copyToClipboard } from '@/features/lab/utils/copy';
import { sortProviders, WriteSecretModal } from './write-secret-modal';
import type { ListSecretKeysResponse } from '@/features/lab/core/network/types';
import { useRequestClient } from '@/features/lab/core/network/requests';
import {
  PanelSection,
  PanelRow,
  PanelActions,
  PanelActionButton,
  PanelEmpty,
  PanelBadge,
  PanelBadgeTag,
  PanelText,
} from '@/components/shared/panel';

// ─── Types ──────────────────────────────────────────────

type ProviderEntry = ListSecretKeysResponse['keys'][number];

// ─── Shared hooks ───────────────────────────────────────

function useSecretsData() {
  const { openModal, closeModal } = useImperativeModal();
  const {
    data: secretKeyProviders,
    isPending,
    error,
    refetch,
  } = useAsyncData(async () => {
    const result = await SECRETS_REGISTRY.request({});
    return sortProviders(result.secrets);
  }, []);

  const writableProviders = (secretKeyProviders ?? []).filter(
    (p) => p.provider !== 'env',
  );
  const providerNames = writableProviders.map((p) => p.name);
  const existingKeys = new Set(
    (secretKeyProviders ?? []).flatMap((p) => p.keys),
  );

  return {
    secretKeyProviders,
    isPending,
    error,
    refetch,
    providerNames,
    existingKeys,
    openModal,
    closeModal,
  };
}

// ─── Secrets Panel Content ──────────────────────────────

function SecretsPanel() {
  const {
    secretKeyProviders,
    isPending,
    error,
    refetch,
    providerNames,
    existingKeys,
    openModal,
    closeModal,
  } = useSecretsData();

  if (isPending) return <Spinner size="medium" centered={true} />;
  if (error) return <ErrorBanner error={error} />;

  if (!secretKeyProviders || secretKeyProviders.length === 0) {
    return (
      <PanelEmpty
        title="No secrets"
        description="No environment variables are available."
        icon={<KeyIcon />}
      />
    );
  }

  return (
    <div data-slot="secrets-panel" className="flex flex-col h-full">
      {(secretKeyProviders ?? []).map((provider) => (
        <ProviderGroup
          key={`${provider.provider}-${provider.name}`}
          provider={provider}
          providerNames={providerNames}
          existingKeys={existingKeys}
          onRefetch={refetch}
          onOpenModal={openModal}
          onCloseModal={closeModal}
        />
      ))}
    </div>
  );
}

function ProviderGroup({
  provider,
  providerNames,
  existingKeys,
  onRefetch,
  onOpenModal,
  onCloseModal,
}: {
  provider: ProviderEntry;
  providerNames: string[];
  existingKeys: Set<string>;
  onRefetch: () => void;
  onOpenModal: (node: React.ReactNode) => void;
  onCloseModal: () => void;
}) {
  const isWritable = provider.provider === 'dotenv';
  if (provider.keys.length === 0) return null;

  return (
    <div data-slot="provider-group">
      <PanelSection className="py-1.5 bg-mine-bg/50" noBorder>
        <div className="flex items-center gap-1.5">
          {isWritable ? (
            <FileText className="w-3 h-3 text-mine-accent-teal" />
          ) : (
            <Lock className="w-3 h-3 text-mine-muted" />
          )}
          <PanelText variant="hint" className="font-medium">
            {provider.name}
          </PanelText>
          <PanelBadgeTag color={isWritable ? 'teal' : 'muted'}>
            {isWritable ? 'writable' : 'read-only'}
          </PanelBadgeTag>
          <PanelBadge>{provider.keys.length}</PanelBadge>
        </div>
      </PanelSection>

      {provider.keys.map((key) => (
        <SecretKeyRow
          key={`${provider.name}-${key}`}
          secretKey={key}
          provider={provider}
          providerNames={providerNames}
          existingKeys={existingKeys}
          onRefetch={onRefetch}
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
        />
      ))}
    </div>
  );
}

function SecretKeyRow({
  secretKey,
  provider,
  providerNames,
  existingKeys,
  onRefetch,
  onOpenModal,
  onCloseModal,
}: {
  secretKey: string;
  provider: ProviderEntry;
  providerNames: string[];
  existingKeys: Set<string>;
  onRefetch: () => void;
  onOpenModal: (node: React.ReactNode) => void;
  onCloseModal: () => void;
}) {
  const isWritable = provider.provider === 'dotenv';
  const [deleting, setDeleting] = React.useState(false);
  const [revealedValue, setRevealedValue] = React.useState<string | null>(null);
  const [revealing, setRevealing] = React.useState(false);
  const requestClient = useRequestClient();

  const handleReveal = React.useCallback(async () => {
    if (revealedValue !== null) {
      setRevealedValue(null);
      return;
    }
    setRevealing(true);
    try {
      const result = await requestClient.readSecretValue({
        key: secretKey,
        provider: provider.provider,
        name: provider.name,
      });
      setRevealedValue(result.value ?? '(empty)');
      setTimeout(() => setRevealedValue(null), 5000);
    } catch {
      toast({
        title: 'Cannot read value',
        description: 'This provider does not support reading values.',
        variant: 'danger',
      });
    } finally {
      setRevealing(false);
    }
  }, [secretKey, provider, revealedValue, requestClient]);

  const handleRotate = React.useCallback(() => {
    onOpenModal(
      <WriteSecretModal
        providerNames={providerNames}
        existingKeys={existingKeys}
        initialKey={secretKey}
        keyReadonly={true}
        onSuccess={() => {
          onRefetch();
          onCloseModal();
        }}
        onClose={onCloseModal}
      />,
    );
  }, [
    secretKey,
    providerNames,
    existingKeys,
    onRefetch,
    onOpenModal,
    onCloseModal,
  ]);

  const handleDelete = React.useCallback(async () => {
    if (!window.confirm(`Delete "${secretKey}" from ${provider.name}?`)) return;
    setDeleting(true);
    try {
      await requestClient.deleteSecret({
        key: secretKey,
        provider: provider.provider,
        name: provider.name,
      });
      toast({
        title: 'Secret deleted',
        description: `"${secretKey}" removed.`,
      });
      onRefetch();
    } catch (err) {
      toast({
        title: 'Delete failed',
        description:
          err instanceof Error ? err.message : 'Could not delete secret.',
        variant: 'danger',
      });
    } finally {
      setDeleting(false);
    }
  }, [secretKey, provider, onRefetch, requestClient]);

  return (
    <PanelRow className="border-b border-mine-border/10">
      <div className="flex-1 min-w-0">
        <PanelText variant="value" className="truncate block text-xs">
          {secretKey}
        </PanelText>
        {revealedValue !== null && (
          <PanelText variant="hint" className="font-mono truncate block">
            {revealedValue}
          </PanelText>
        )}
      </div>

      <PanelActions>
        {isWritable && (
          <PanelActionButton
            icon={revealedValue !== null ? <EyeOff /> : <Eye />}
            label={`${revealedValue !== null ? 'Hide' : 'Reveal'} ${secretKey}`}
            onClick={handleReveal}
            disabled={revealing}
          />
        )}
        <CopyButton
          ariaLabel={`Copy ${secretKey}`}
          onCopy={async () => {
            await copyToClipboard(`os.environ["${secretKey}"]`);
            toast({
              title: 'Copied',
              description: `os.environ["${secretKey}"]`,
            });
          }}
        />
        {isWritable && (
          <PanelActionButton
            icon={<RefreshCw />}
            label={`Rotate ${secretKey}`}
            hoverColor="teal"
            onClick={handleRotate}
          />
        )}
        {isWritable && (
          <PanelActionButton
            icon={<Trash2 />}
            label={`Delete ${secretKey}`}
            hoverColor="red"
            onClick={handleDelete}
            disabled={deleting}
          />
        )}
      </PanelActions>
    </PanelRow>
  );
}

function CopyButton({
  ariaLabel,
  onCopy,
}: {
  ariaLabel: string;
  onCopy: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <PanelActionButton
      icon={
        copied ? (
          <CheckIcon className="text-market-down-medium" />
        ) : (
          <CopyIcon />
        )
      }
      label={ariaLabel}
      onClick={handleCopy}
    />
  );
}

export { SecretsPanel };
