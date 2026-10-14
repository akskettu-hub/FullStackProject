export type errorCodeAndMsg = { code: string; message: string };

export const errorsToStr = (errors: errorCodeAndMsg[]): string => {
  return errors
    .map(
      (codeAndMsg: errorCodeAndMsg) =>
        `${codeAndMsg.code}: ${codeAndMsg.message}\n`,
    )
    .join("");
};
