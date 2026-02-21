/**
 * merge-refs — Merge multiple React refs into one
 * 迁移自 marimo:utils/mergeRefs.ts L1-L14
 * 修改: 无（完整迁移）
 */

export function mergeRefs<T>(
  ...refs: React.Ref<T>[]
): (value: T | null) => void {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
