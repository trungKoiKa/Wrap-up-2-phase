import type { SimSpec } from '../data/lessons/types'

/** Mô phỏng tương tác của từng buổi, khoá là id bài học (day16 … day27); một buổi có thể có nhiều mô phỏng. */
export declare const SIMS: Record<string, SimSpec | SimSpec[]>

/** Hình minh hoạ tĩnh, khoá là `Concept.fig`; mỗi hàm trả về một chuỗi SVG. */
export declare const FIGS: Record<string, () => string>
