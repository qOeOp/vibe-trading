import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tree, File, Folder } from '../file-tree';

describe('File Tree', () => {
  describe('File selection (single click)', () => {
    it('highlights file on single click', () => {
      render(
        <Tree>
          <File value="a.py">a.py</File>
          <File value="b.py">b.py</File>
        </Tree>,
      );

      const fileA = screen.getByText('a.py');
      fireEvent.click(fileA);

      // The button containing a.py should have the selected class
      expect(fileA.closest('button')).toHaveClass('bg-mine-bg');
    });

    it('does NOT call onDoubleClickItem on single click', () => {
      const onDoubleClick = vi.fn();
      render(
        <Tree onDoubleClickItem={onDoubleClick}>
          <File value="a.py">a.py</File>
        </Tree>,
      );

      fireEvent.click(screen.getByText('a.py'));
      expect(onDoubleClick).not.toHaveBeenCalled();
    });
  });

  describe('File open (double click)', () => {
    it('calls onDoubleClickItem on double click', () => {
      const onDoubleClick = vi.fn();
      render(
        <Tree onDoubleClickItem={onDoubleClick}>
          <File value="factor.py">factor.py</File>
        </Tree>,
      );

      fireEvent.doubleClick(screen.getByText('factor.py'));
      expect(onDoubleClick).toHaveBeenCalledWith('factor.py');
    });

    it('also selects the file on double click', () => {
      const onDoubleClick = vi.fn();
      render(
        <Tree onDoubleClickItem={onDoubleClick}>
          <File value="a.py">a.py</File>
          <File value="b.py">b.py</File>
        </Tree>,
      );

      fireEvent.doubleClick(screen.getByText('b.py'));
      expect(screen.getByText('b.py').closest('button')).toHaveClass(
        'bg-mine-bg',
      );
    });
  });
});
