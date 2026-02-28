/* Copyright 2026 Marimo. All rights reserved. */
import React from 'react';
import { Button } from '@/features/lab/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/lab/components/ui/dialog';
import { FormDescription } from '@/features/lab/components/ui/field';
import { Input } from '@/features/lab/components/ui/input';
import { Label } from '@/features/lab/components/ui/label';
import { ExternalLink } from '@/features/lab/components/ui/links';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/lab/components/ui/select';
import { toast } from '@/features/lab/components/ui/use-toast';
import { useRequestClient } from '@/features/lab/core/network/requests';
import type { ListSecretKeysResponse } from '@/features/lab/core/network/types';

// dotenv providers should be at the top
export function sortProviders(providers: ListSecretKeysResponse['keys']) {
  return providers.sort((a, b) => {
    if (a.provider === 'env') {
      return 1;
    }
    if (b.provider === 'env') {
      return -1;
    }
    return 0;
  });
}

/**
 * A modal component that allows users to add a new secret
 */
export const WriteSecretModal: React.FC<{
  providerNames: string[];
  existingKeys?: Set<string>;
  initialKey?: string;
  keyReadonly?: boolean;
  onClose: () => void;
  onSuccess: (secretName: string) => void;
}> = ({
  providerNames,
  existingKeys,
  initialKey,
  keyReadonly,
  onClose,
  onSuccess,
}) => {
  const { writeSecret } = useRequestClient();
  const [key, setKey] = React.useState(initialKey ?? '');
  const [value, setValue] = React.useState('');
  const isDuplicate = !keyReadonly && !!existingKeys?.has(key);
  const [location, setLocation] = React.useState<string | undefined>(
    providerNames[0],
  );
  // Only dotenv is supported for now
  const provider = 'dotenv';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast({
        title: 'Error',
        description: 'No location selected for the secret.',
        variant: 'danger',
      });
      return;
    }

    if (!key || !value || !location) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'danger',
      });
      return;
    }

    try {
      await writeSecret({
        key,
        value,
        provider,
        name: location,
      });
      toast({
        title: 'Secret created',
        description: 'The secret has been created successfully.',
      });
      onSuccess(key);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create secret. Please try again.',
        variant: 'danger',
      });
    }
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {keyReadonly ? 'Rotate Secret' : 'Add Secret'}
          </DialogTitle>
          <DialogDescription>
            {keyReadonly
              ? `Update the value of "${initialKey}".`
              : 'Add a new secret to your environment variables.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => {
                // Remove any non-word characters from the input
                setKey(replaceInvalid(e.target.value));
              }}
              placeholder="MY_SECRET_KEY"
              required={true}
              readOnly={keyReadonly}
              className={keyReadonly ? 'opacity-60' : undefined}
            />
            {isDuplicate && (
              <p className="text-[11px] text-mine-accent-yellow">
                Key already exists — value will be overwritten.
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required={true}
              autoComplete="off"
            />
            {/* http is prone to man-in-the-middle */}
            {isHttpUrl() && (
              <FormDescription>
                Note: You are sending this key over http.
              </FormDescription>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            {providerNames.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No dotenv locations configured.
              </p>
            )}
            {providerNames.length > 0 && (
              <Select
                value={location}
                onValueChange={(value) => setLocation(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providerNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <FormDescription>
              You can configure the location by setting the{' '}
              <ExternalLink href="https://links.marimo.app/dotenv">
                dotenv configuration
              </ExternalLink>
              .
            </FormDescription>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!key || !value || !location}>
            {keyReadonly ? 'Update' : isDuplicate ? 'Overwrite' : 'Add Secret'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export function replaceInvalid(input: string): string {
  return input.replaceAll(/\W/g, '_');
}

function isHttpUrl(): boolean {
  const url = window.location.href;
  return url.startsWith('http://');
}
