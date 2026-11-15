import { UNKNOWN, type Unknown } from './enums';
import type { components } from './schema';

/** Codes que o contrato conhece hoje (enum ErrorCode do openapi.json). */
export type ErrorCode = components['schemas']['ErrorCode'];

/**
 * Code de um ApiError: o front conhece os codes do contrato, mas aceita
 * code novo sem quebrar (a lista pode crescer). `string & {}` mantém o
 * autocomplete dos codes conhecidos.
 */
export type ApiErrorCode = ErrorCode | Unknown | (string & {});

/**
 * Erro de uma resposta não-2xx da API. Decida sempre pelo `code` (com
 * `hasCode`), nunca pelo texto de `message`, que é para pessoas e muda.
 */
export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly status: number;
  readonly code: ApiErrorCode;
  /** Lista de erros de validação (só em 400 VALIDATION_FAILED). */
  readonly errors?: string[];

  constructor(init: {
    status: number;
    code: ApiErrorCode;
    message: string;
    errors?: string[];
  }) {
    super(init.message);
    this.status = init.status;
    this.code = init.code;
    if (init.errors) this.errors = init.errors;
  }
}

const DEFAULT_MESSAGES: Readonly<Record<number, string>> = {
  400: 'Requisição inválida',
  401: 'Sessão expirada ou não iniciada. Entre de novo',
  403: 'Você não tem permissão para esta ação',
  404: 'Não encontrado',
  409: 'Conflito com o estado atual. Recarregue e tente de novo',
  413: 'Conteúdo grande demais',
  415: 'Formato de conteúdo não suportado',
  429: 'Muitas requisições. Aguarde um pouco e tente de novo',
};

/** Mensagem em pt-BR para quando o corpo do erro não traz uma. */
export function defaultMessageForStatus(status: number): string {
  const mapped = DEFAULT_MESSAGES[status];
  if (mapped) return mapped;
  if (status >= 500 && status <= 599) {
    return 'Erro no servidor. Tente de novo mais tarde';
  }
  if (status >= 400 && status <= 499) {
    return 'Não foi possível concluir a requisição';
  }
  return 'Erro inesperado';
}

function asRecord(body: unknown): Record<string, unknown> {
  let value = body;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return {};
    }
  }
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

/**
 * Monta um ApiError a partir da resposta e do corpo já lido (objeto, texto
 * JSON, texto qualquer, vazio ou ausente). Nunca lança.
 */
export function parseApiError(
  response: Pick<Response, 'status'>,
  body: unknown,
): ApiError {
  const record = asRecord(body);
  const errors =
    Array.isArray(record.errors) &&
    record.errors.every((item) => typeof item === 'string')
      ? record.errors
      : undefined;

  return new ApiError({
    status: response.status,
    code: nonEmptyString(record.code) ?? UNKNOWN,
    message:
      nonEmptyString(record.message) ??
      defaultMessageForStatus(response.status),
    ...(errors ? { errors } : {}),
  });
}

/** O erro é um ApiError com este code? Decida por aqui, nunca pela mensagem. */
export function hasCode(
  error: unknown,
  code: ErrorCode | Unknown,
): error is ApiError {
  return error instanceof ApiError && error.code === code;
}
