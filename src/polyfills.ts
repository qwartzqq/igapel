// @ton/core relies on Node's Buffer/global, which aren't available in the browser by default.
// This must be imported BEFORE any module that (transitively) imports @ton/core,
// since ES module imports are evaluated in order before the importing file's own code runs.
import { Buffer } from 'buffer';

(window as any).Buffer = (window as any).Buffer || Buffer;
(window as any).global = (window as any).global || window;
