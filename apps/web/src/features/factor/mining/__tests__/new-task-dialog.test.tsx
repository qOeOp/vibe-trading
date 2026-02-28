import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewTaskDialog } from '../components/new-task-dialog';

describe('NewTaskDialog', () => {
  it('calls onSubmit with correct config when form submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<NewTaskDialog open={true} onClose={onClose} onSubmit={onSubmit} />);

    // Defaults are pre-filled — just submit
    const submitBtn = screen.getByRole('button', { name: /开始挖掘/i });
    fireEvent.click(submitBtn);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    const config = onSubmit.mock.calls[0][0];
    expect(config.mode).toBe('factor');
    expect(config.maxLoops).toBeGreaterThan(0);
    expect(config.universe).toBeTruthy();
  });

  it('does not call onSubmit when dialog is closed', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(<NewTaskDialog open={true} onClose={onClose} onSubmit={onSubmit} />);

    const cancelBtn = screen.getByRole('button', { name: /取消/i });
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
