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
import { cn } from '@/features/lab/utils/cn';
import { copyToClipboard } from '@/features/lab/utils/copy';
import { PanelEmptyState } from './empty-state';
import { sortProviders, WriteSecretModal } from './write-secret-modal';
import type { ListSecretKeysResponse } from '@/features/lab/core/network/types';
import { useRequestClient } from '@/features/lab/core/network/requests';
import {
  PanelBar,
  PanelBody,
  PanelSection,
  PanelRow,
  PanelActions,
  PanelActionButton,
  PanelEmpty,
  PanelBadge,
  PanelBadgeTag,
  PanelText,
  usePanelV2,
} from '../../../panel-primitives';

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

// ─── V2 (primitives) ────────────────────────────────────

function SecretsPanelV2() {
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
  const [isV2, toggleV2] = usePanelV2('secrets-panel');

  if (isPending) return <Spinner size="medium" centered={true} />;
  if (error) return <ErrorBanner error={error} />;

  if (!secretKeyProviders || secretKeyProviders.length === 0) {
    return (
      <div data-slot="secrets-panel" className="flex flex-col h-full">
        <PanelBar
          title="Environment Variables"
          v2={{ active: isV2, onToggle: toggleV2 }}
        />
        <PanelBody>
          <PanelEmpty
            title="No secrets"
            description="No environment variables are available."
            icon={<KeyIcon />}
          />
        </PanelBody>
      </div>
    );
  }

  return (
    <div data-slot="secrets-panel" className="flex flex-col h-full">
      <PanelBar
        title="Environment Variables"
        right={
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md
              bg-mine-nav-active text-white hover:bg-mine-nav-active/90 transition-colors"
            onClick={() =>
              openModal(
                <WriteSecretModal
                  providerNames={providerNames}
                  existingKeys={existingKeys}
                  onSuccess={() => {
                    refetch();
                    closeModal();
                  }}
                  onClose={closeModal}
                />,
              )
            }
          >
            <PlusIcon className="w-3 h-3" />
            Add
          </button>
        }
        v2={{ active: isV2, onToggle: toggleV2 }}
      />

      <PanelBody>
        {(secretKeyProviders ?? []).map((provider) => (
          <ProviderGroupV2
            key={`${provider.provider}-${provider.name}`}
            provider={provider}
            providerNames={providerNames}
            existingKeys={existingKeys}
            onRefetch={refetch}
            onOpenModal={openModal}
            onCloseModal={closeModal}
          />
        ))}
      </PanelBody>
    </div>
  );
}

function ProviderGroupV2({
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
      <PanelSection className="py-1.5 bg-mine-bg/50">
        <div className="flex items-center gap-1.5">
          {isWritable ? (
            <FileText className="w-3 h-3 text-mine-accent-teal" />
          ) : (
            <Lock className="w-3 h-3 text-mine-muted" />
          )}
          <PanelText variant="sub" className="font-medium">
            {provider.name}
          </PanelText>
          <PanelBadgeTag color={isWritable ? 'teal' : 'muted'}>
            {isWritable ? 'writable' : 'read-only'}
          </PanelBadgeTag>
          <PanelBadge>{provider.keys.length}</PanelBadge>
        </div>
      </PanelSection>

      {provider.keys.map((key) => (
        <SecretKeyRowV2
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

function SecretKeyRowV2({
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
        <PanelText variant="mono" className="truncate block text-xs">
          {secretKey}
        </PanelText>
        {revealedValue !== null && (
          <PanelText variant="sub" className="font-mono truncate block">
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
        <CopyButtonV2
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

function CopyButtonV2({
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

// ─── V1 (original) ──────────────────────────────────────

function SecretsPanelV1() {
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
  const [, toggleV2] = usePanelV2('secrets-panel');

  if (isPending) return <Spinner size="medium" centered={true} />;
  if (error) return <ErrorBanner error={error} />;

  if (!secretKeyProviders || secretKeyProviders.length === 0) {
    return (
      <PanelEmptyState
        title="No secrets"
        description="No environment variables are available."
        icon={<KeyIcon />}
      />
    );
  }

  return (
    <div data-slot="secrets-panel" className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-mine-border/30">
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          Environment Variables
        </span>
        <div className="flex-1" />
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md
            bg-mine-nav-active text-white hover:bg-mine-nav-active/90 transition-colors"
          onClick={() =>
            openModal(
              <WriteSecretModal
                providerNames={providerNames}
                existingKeys={existingKeys}
                onSuccess={() => {
                  refetch();
                  closeModal();
                }}
                onClose={closeModal}
              />,
            )
          }
        >
          <PlusIcon className="w-3 h-3" />
          Add
        </button>
        <button
          type="button"
          onClick={toggleV2}
          className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors"
          title="Switch to v2 (new)"
        >
          <span className="text-[8px] font-mono">v2</span>
        </button>
      </div>

      {/* Secret list grouped by provider */}
      <div className="flex-1 overflow-y-auto">
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
    </div>
  );
}

// ─── V1 Provider Group ──────────────────────────────────

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
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-mine-bg/50">
        {isWritable ? (
          <FileText className="w-3 h-3 text-mine-accent-teal" />
        ) : (
          <Lock className="w-3 h-3 text-mine-muted" />
        )}
        <span className="text-[10px] font-medium text-mine-muted">
          {provider.name}
        </span>
        <span
          className={cn(
            'px-1 py-0.5 text-[9px] font-medium rounded',
            isWritable
              ? 'bg-mine-accent-teal/10 text-mine-accent-teal'
              : 'bg-mine-bg text-mine-muted',
          )}
        >
          {isWritable ? 'writable' : 'read-only'}
        </span>
        <span className="text-[9px] text-mine-muted/60 font-mono tabular-nums">
          {provider.keys.length}
        </span>
      </div>

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

// ─── V1 Key Row ─────────────────────────────────────────

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
    <div
      data-slot="secret-key-row"
      className="flex items-center gap-2 px-3 py-1.5 group hover:bg-mine-bg/30 transition-colors border-b border-mine-border/10"
    >
      <div className="flex-1 min-w-0">
        <span className="text-xs font-mono text-mine-text truncate block">
          {secretKey}
        </span>
        {revealedValue !== null && (
          <span className="text-[10px] font-mono text-mine-muted truncate block">
            {revealedValue}
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {isWritable && (
          <button
            type="button"
            className="p-1 rounded text-mine-muted hover:text-mine-text transition-colors"
            onClick={handleReveal}
            disabled={revealing}
            aria-label={`${revealedValue !== null ? 'Hide' : 'Reveal'} ${secretKey}`}
          >
            {revealedValue !== null ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
          </button>
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
          <button
            type="button"
            className="p-1 rounded text-mine-muted hover:text-mine-accent-teal transition-colors"
            onClick={handleRotate}
            aria-label={`Rotate ${secretKey}`}
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
        {isWritable && (
          <button
            type="button"
            className="p-1 rounded text-mine-muted hover:text-market-up-medium transition-colors"
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Delete ${secretKey}`}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
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
    <button
      type="button"
      className="p-1 rounded text-mine-muted hover:text-mine-text transition-colors"
      onClick={handleCopy}
      aria-label={ariaLabel}
    >
      {copied ? (
        <CheckIcon className="w-3 h-3 text-market-down-medium" />
      ) : (
        <CopyIcon className="w-3 h-3" />
      )}
    </button>
  );
}

// ─── Switch ─────────────────────────────────────────────

const SecretsPanel: React.FC = () => {
  const [isV2] = usePanelV2('secrets-panel');
  return isV2 ? <SecretsPanelV2 /> : <SecretsPanelV1 />;
};

export default SecretsPanel;
