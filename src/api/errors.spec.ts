import { ApiError, hasCode, parseApiError } from './errors';

function response(status: number): Response {
  return new Response(null, { status });
}

describe('parseApiError', () => {
  it('lê status, code conhecido e mensagem do corpo de erro da API', () => {
    const error = parseApiError(response(404), {
      statusCode: 404,
      code: 'LISTING_NOT_FOUND',
      error: 'Not Found',
      message: 'Anúncio não encontrado',
      path: '/listings/123',
      timestamp: '2026-11-10T12:00:00.000Z',
    });

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ApiError');
    expect(error.status).toBe(404);
    expect(error.code).toBe('LISTING_NOT_FOUND');
    expect(error.message).toBe('Anúncio não encontrado');
    expect(error.errors).toBeUndefined();
  });

  it('preserva um code que o front não conhece, sem quebrar', () => {
    const error = parseApiError(response(409), {
      code: 'CODIGO_NOVO_QUALQUER',
      message: 'Algo novo aconteceu',
    });

    expect(error.code).toBe('CODIGO_NOVO_QUALQUER');
    expect(error.message).toBe('Algo novo aconteceu');
  });

  it('usa o code UNKNOWN quando o corpo não tem code', () => {
    const error = parseApiError(response(400), { message: 'Dados inválidos' });

    expect(error.code).toBe('UNKNOWN');
    expect(error.message).toBe('Dados inválidos');
  });

  it('usa o code UNKNOWN quando o code não é texto', () => {
    const error = parseApiError(response(400), { code: 42, message: 'x' });

    expect(error.code).toBe('UNKNOWN');
  });

  it('aceita corpo que não é JSON (texto ou HTML de um proxy)', () => {
    const error = parseApiError(
      response(502),
      '<html><body>Bad Gateway</body></html>',
    );

    expect(error.status).toBe(502);
    expect(error.code).toBe('UNKNOWN');
    expect(error.message).toBe('Erro no servidor. Tente de novo mais tarde');
  });

  it('aceita corpo vazio', () => {
    const error = parseApiError(response(404), '');

    expect(error.code).toBe('UNKNOWN');
    expect(error.message).toBe('Não encontrado');
  });

  it.each([undefined, null])('aceita corpo %s', (body) => {
    const error = parseApiError(response(403), body);

    expect(error.code).toBe('UNKNOWN');
    expect(error.message).toBe('Você não tem permissão para esta ação');
  });

  it('lê o corpo JSON que chegou como texto', () => {
    const error = parseApiError(
      response(409),
      '{"code":"INVALID_STATE","message":"Ação não permitida no estado atual"}',
    );

    expect(error.code).toBe('INVALID_STATE');
    expect(error.message).toBe('Ação não permitida no estado atual');
  });

  it('usa a mensagem padrão quando a mensagem do corpo está vazia', () => {
    const error = parseApiError(response(401), {
      code: 'UNAUTHENTICATED',
      message: '',
    });

    expect(error.code).toBe('UNAUTHENTICATED');
    expect(error.message).toBe(
      'Sessão expirada ou não iniciada. Entre de novo',
    );
  });

  it.each([
    [400, 'Requisição inválida'],
    [401, 'Sessão expirada ou não iniciada. Entre de novo'],
    [403, 'Você não tem permissão para esta ação'],
    [404, 'Não encontrado'],
    [409, 'Conflito com o estado atual. Recarregue e tente de novo'],
    [413, 'Conteúdo grande demais'],
    [415, 'Formato de conteúdo não suportado'],
    [429, 'Muitas requisições. Aguarde um pouco e tente de novo'],
    [418, 'Não foi possível concluir a requisição'],
    [500, 'Erro no servidor. Tente de novo mais tarde'],
    [503, 'Erro no servidor. Tente de novo mais tarde'],
    [0, 'Erro inesperado'],
  ])('usa a mensagem padrão em pt-BR para o status %i', (status, message) => {
    const error = parseApiError({ status }, {});

    expect(error.message).toBe(message);
  });

  it('preserva a lista errors de um 400 de validação', () => {
    const error = parseApiError(response(400), {
      code: 'VALIDATION_FAILED',
      message: 'Dados inválidos',
      errors: ['email must be an email', 'password should not be empty'],
    });

    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.errors).toEqual([
      'email must be an email',
      'password should not be empty',
    ]);
  });

  it('ignora errors quando não é uma lista de textos', () => {
    const error = parseApiError(response(400), {
      code: 'VALIDATION_FAILED',
      message: 'Dados inválidos',
      errors: 'email must be an email',
    });

    expect(error.errors).toBeUndefined();
  });
});

describe('hasCode', () => {
  const error = parseApiError(response(409), {
    code: 'SLOT_UNAVAILABLE',
    message: 'Horário indisponível',
  });

  it('devolve true quando o ApiError tem o code pedido', () => {
    expect(hasCode(error, 'SLOT_UNAVAILABLE')).toBe(true);
  });

  it('devolve false quando o ApiError tem outro code', () => {
    expect(hasCode(error, 'INVALID_STATE')).toBe(false);
  });

  it('não decide pela mensagem', () => {
    const sameMessage = parseApiError(response(409), {
      code: 'CONFLICT',
      message: 'Horário indisponível',
    });

    expect(hasCode(sameMessage, 'SLOT_UNAVAILABLE')).toBe(false);
  });

  it('devolve false para um erro que não é ApiError, mesmo com a propriedade code', () => {
    const plain = Object.assign(new Error('x'), { code: 'SLOT_UNAVAILABLE' });

    expect(hasCode(plain, 'SLOT_UNAVAILABLE')).toBe(false);
  });

  it.each([null, undefined, 'SLOT_UNAVAILABLE', { code: 'SLOT_UNAVAILABLE' }])(
    'devolve false para %s',
    (value) => {
      expect(hasCode(value, 'SLOT_UNAVAILABLE')).toBe(false);
    },
  );

  it('reconhece o code UNKNOWN de um corpo sem code', () => {
    const unknown = parseApiError(response(500), '');

    expect(hasCode(unknown, 'UNKNOWN')).toBe(true);
  });
});
