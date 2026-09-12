const testGlobal = globalThis as typeof globalThis &
  Record<'IS_REACT_ACT_ENVIRONMENT', boolean | undefined>;

testGlobal['IS_REACT_ACT_ENVIRONMENT'] = true;
