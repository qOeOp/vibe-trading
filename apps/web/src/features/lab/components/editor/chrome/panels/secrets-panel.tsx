/* Copyright 2026 Marimo. All rights reserved. */

import { CheckIcon, CopyIcon, KeyIcon, PlusIcon } from 'lucide-react';
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Spinner } from '@/features/lab/components/icons/spinner';
import { useImperativeModal } from '@/features/lab/components/modal/ImperativeModal';
import { Badge } from '@/features/lab/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/lab/components/ui/table';
import { toast } from '@/features/lab/components/ui/use-toast';
import { SECRETS_REGISTRY } from '@/features/lab/core/secrets/request-registry';
import { useAsyncData } from '@/features/lab/hooks/useAsyncData';
import { ErrorBanner } from '@/features/lab/plugins/impl/common/error-banner';
import { cn } from '@/features/lab/utils/cn';
import { copyToClipboard } from '@/features/lab/utils/copy';
import { PanelEmptyState } from './empty-state';
import { sortProviders, WriteSecretModal } from './write-secret-modal';
import {
  PanelBar,
  PanelBody,
  PanelSection,
  PanelRow,
  PanelEmpty,
  PanelText,
  PanelActions,
  PanelActionButton,
  PanelBadgeTag,
  usePanelV2,
} from '../../../panel-primitives';

// ─── Shared data hook ────────────────────────────────────

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

  const providerNames = (secretKeyProviders ?? [])
    .filter((provider) => provider.provider !== 'env')
    .map((provider) => provider.name);

  const openWriteModal = () =>
    openModal(
      <WriteSecretModal
        providerNames={providerNames}
        onSuccess={() => {
          refetch();
          closeModal();
        }}
        onClose={closeModal}
      />,
    );

  return { secretKeyProviders, isPending, error, openWriteModal };
}

// ─── V2 (primitives) ────────────────────────────────────

function SecretsPanelV2() {
  const { secretKeyProviders, isPending, error, openWriteModal } =
    useSecretsData();
  const [isV2, toggleV2] = usePanelV2('secrets-panel');

  if (isPending) {
    return <Spinner size="medium" centered={true} />;
  }

  if (error) {
    return <ErrorBanner error={error} />;
  }

  const providers = secretKeyProviders ?? [];

  return (
    <div data-slot="secrets-panel" className="h-full flex flex-col">
      <PanelBar
        title="环境变量"
        icon={<KeyIcon />}
        right={
          <PanelActionButton
            icon={<PlusIcon />}
            label="添加变量"
            hoverColor="teal"
            onClick={openWriteModal}
          />
        }
        v2={{ active: isV2, onToggle: toggleV2 }}
      />
      <PanelBody>
        {providers.length === 0 ? (
          <PanelEmpty
            title="暂无环境变量"
            description="当前 notebook 没有可用的环境变量"
            icon={<KeyIcon />}
          />
        ) : (
          <PanelSection>
            {/* Header row */}
            <div className="flex items-center gap-2 pb-1.5 mb-1 border-b border-mine-border/20">
              <PanelText variant="title" className="flex-1">
                变量名
              </PanelText>
              <PanelText variant="title" className="w-16 text-right">
                来源
              </PanelText>
            </div>
            {/* Secret rows */}
            {providers.map((provider) =>
              provider.keys.map((key) => (
                <PanelRow
                  key={`${provider.name}-${key}`}
                  className="px-0 py-1 border-b border-mine-border/10 last:border-b-0"
                >
                  <PanelText variant="mono" className="flex-1 truncate">
                    {key}
                  </PanelText>
                  {provider.provider !== 'env' && (
                    <PanelBadgeTag color="muted">{provider.name}</PanelBadgeTag>
                  )}
                  <PanelActions>
                    <PanelActionButton
                      icon={<CopyIcon />}
                      label={`Copy ${key}`}
                      onClick={async () => {
                        await copyToClipboard(`os.environ["${key}"]`);
                        toast({
                          title: '已复制',
                          description: `os.environ["${key}"] 已复制到剪贴板`,
                        });
                      }}
                    />
                  </PanelActions>
                </PanelRow>
              )),
            )}
          </PanelSection>
        )}
      </PanelBody>
    </div>
  );
}

// ─── V1 (original marimo) ───────────────────────────────

function SecretsPanelV1() {
  const { secretKeyProviders, isPending, error, openWriteModal } =
    useSecretsData();
  const [, toggleV2] = usePanelV2('secrets-panel');

  if (isPending) {
    return <Spinner size="medium" centered={true} />;
  }

  if (error) {
    return <ErrorBanner error={error} />;
  }

  const providers = secretKeyProviders ?? [];

  if (providers.length === 0) {
    return (
      <PanelEmptyState
        title="No environment variables"
        description="No environment variables are available in this notebook."
        icon={<KeyIcon />}
      />
    );
  }

  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel defaultSize={50} minSize={30} maxSize={80}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center h-8 border-b">
            <button
              type="button"
              className="border-r px-2 m-0 h-full hover:bg-accent hover:text-accent-foreground"
              onClick={openWriteModal}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleV2}
              className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors mr-2"
              title="Switch to v2"
            >
              <span className="text-[8px] font-mono">v2</span>
            </button>
          </div>
          <Table className="overflow-auto flex-1 mb-16">
            <TableHeader>
              <TableRow>
                <TableHead>Environment Variable</TableHead>
                <TableHead>Source</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => {
                return provider.keys.map((key) => (
                  <TableRow key={`${provider.name}-${key}`} className="group">
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      {provider.provider !== 'env' && (
                        <Badge variant="outline" className="select-none">
                          {provider.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <CopyButton
                        ariaLabel={`Copy ${key}`}
                        onCopy={async () => {
                          await copyToClipboard(`os.environ["${key}"]`);
                          toast({
                            title: 'Copied to clipboard',
                            description: `os.environ["${key}"] has been copied to your clipboard.`,
                          });
                        }}
                        className={cn(
                          'float-right px-2 h-full text-xs text-muted-foreground hover:text-foreground',
                          'invisible group-hover:visible',
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </div>
      </Panel>
      <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
      <Panel defaultSize={50}>
        <div />
      </Panel>
    </PanelGroup>
  );
}

// ─── Switch ─────────────────────────────────────────────

const SecretsPanel: React.FC = () => {
  const [isV2] = usePanelV2('secrets-panel');
  return isV2 ? <SecretsPanelV2 /> : <SecretsPanelV1 />;
};

export default SecretsPanel;

const CopyButton: React.FC<{
  className?: string;
  ariaLabel: string;
  onCopy: () => void;
}> = ({ className, ariaLabel, onCopy }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleCopy}
      aria-label={ariaLabel}
    >
      {copied ? (
        <CheckIcon className="w-3 h-3 text-green-700 rounded" />
      ) : (
        <CopyIcon className="w-3 h-3 hover:bg-muted rounded" />
      )}
    </button>
  );
};
