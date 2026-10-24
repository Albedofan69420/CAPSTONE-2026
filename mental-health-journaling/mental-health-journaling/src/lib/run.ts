// Utilidades para el RUN chileno: cuerpo numérico + dígito verificador (0-9 o K), sin puntos ni guion.

export const RUN_MAX_LENGTH = 9;

/** Deja solo dígitos y una K final, con un máximo de 9 caracteres. */
export function limpiarRun(texto: string) {
  const limpio = texto.toUpperCase().replace(/[^0-9K]/g, "");
  // La K solo puede ser el dígito verificador, al final
  const sinKIntermedias = limpio.slice(0, -1).replace(/K/g, "") + limpio.slice(-1);
  return sinKIntermedias.slice(0, RUN_MAX_LENGTH);
}

/** Calcula el dígito verificador con el algoritmo módulo 11. */
function digitoVerificador(cuerpo: string) {
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  return resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
}

/** true si el RUN tiene el largo correcto y su dígito verificador coincide. */
export function runValido(run: string) {
  if (!/^[0-9]{7,8}[0-9K]$/.test(run)) return false;
  return digitoVerificador(run.slice(0, -1)) === run.slice(-1);
}

/** 123456789 -> 12.345.678-9 */
export function formatearRun(run: string) {
  if (run.length < 2) return run;
  const cuerpo = run.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpo}-${run.slice(-1)}`;
}
