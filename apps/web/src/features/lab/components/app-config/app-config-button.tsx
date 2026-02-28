/* Copyright 2026 Marimo. All rights reserved. */

import { useAtom, useSetAtom } from 'jotai';
import { SettingsIcon } from 'lucide-react';
import { VisuallyHidden } from 'react-aria';
import { AppConfigForm } from '@/features/lab/components/app-config/app-config-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/lab/components/ui/popover';
import { Button as EditorButton } from '../editor/inputs/Inputs';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Tooltip } from '../ui/tooltip';
import { settingDialogAtom } from './state';
import { UserConfigForm } from './user-config-form';

interface Props {
  showAppConfig?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

/**
 * Standalone settings dialog — always mounted, reads settingDialogAtom.
 * Mount this once at the app root so the dialog opens regardless of
 * whether ConfigButton is in the DOM (e.g. lab active mode hides Controls).
 */
export const UserSettingsDialog: React.FC = () => {
  const [settingDialog, setSettingDialog] = useAtom(settingDialogAtom);
  return (
    <Dialog open={settingDialog} onOpenChange={setSettingDialog}>
      <DialogContent className="w-[90vw] h-[90vh] overflow-hidden sm:max-w-5xl top-[5vh] p-0">
        <VisuallyHidden>
          <DialogTitle>User settings</DialogTitle>
        </VisuallyHidden>
        <UserConfigForm />
      </DialogContent>
    </Dialog>
  );
};

export const ConfigButton: React.FC<Props> = ({
  showAppConfig = true,
  disabled = false,
  tooltip = 'Settings',
}) => {
  const setSettingDialog = useSetAtom(settingDialogAtom);

  const button = (
    <EditorButton
      aria-label="Config"
      data-testid="app-config-button"
      shape="circle"
      size="small"
      className="h-[27px] w-[27px]"
      disabled={disabled}
      color={disabled ? 'disabled' : 'hint-green'}
    >
      <Tooltip content={tooltip}>
        <SettingsIcon strokeWidth={1.8} />
      </Tooltip>
    </EditorButton>
  );

  // When showAppConfig is false, clicking the button directly opens the
  // settings dialog (rendered by the always-mounted UserSettingsDialog).
  if (!showAppConfig) {
    return <span onClick={() => setSettingDialog(true)}>{button}</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild={true}>{button}</PopoverTrigger>
      <PopoverContent
        className="w-[650px] overflow-auto max-h-[80vh] max-w-[80vw]"
        align="end"
        side="bottom"
        onFocusOutside={(evt) => evt.preventDefault()}
      >
        <AppConfigForm />
        <div className="h-px bg-border my-2" />
        <Button
          onClick={() => setSettingDialog(true)}
          variant="link"
          className="px-0"
        >
          <SettingsIcon strokeWidth={1.8} className="w-4 h-4 mr-2" />
          User settings
        </Button>
      </PopoverContent>
    </Popover>
  );
};
