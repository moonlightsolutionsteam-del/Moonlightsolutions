import { useReducedMotion } from 'framer-motion';

/** True when full animation is allowed. */
export const useMotionOk = () => !useReducedMotion();
