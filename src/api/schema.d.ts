/**
 * Gerado pelo openapi-typescript a partir de api/openapi.json.
 * Não edite à mão: rode `npm run api:sync` (contrato novo do back) e
 * commite api/openapi.json e este arquivo juntos.
 */

export interface paths {
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["registerUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCurrentUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inspectors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listInspectors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inspectors/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getMyInspectorProfile"];
        put?: never;
        post: operations["createMyInspectorProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateMyInspectorProfile"];
        trace?: never;
    };
    "/listings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listListings"];
        put?: never;
        post: operations["createListing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listings/mine": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listMyListings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getListing"];
        put?: never;
        post?: never;
        delete: operations["archiveListing"];
        options?: never;
        head?: never;
        patch: operations["updateListing"];
        trace?: never;
    };
    "/listings/{id}/pause": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["pauseListing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listings/{id}/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["activateListing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listings/{id}/mark-sold": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["markListingSold"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/appointments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAppointments"];
        put?: never;
        post: operations["createAppointment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/appointments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAppointment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/appointments/{id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["acceptAppointment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/appointments/{id}/decline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["declineAppointment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/appointments/{id}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["confirmAppointment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/appointments/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelAppointment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * @description Código do erro, estável e legível por máquina. O cliente decide por ele, não pela mensagem, que é texto para pessoas e pode mudar. A lista pode crescer; trate code desconhecido pelo status HTTP.
         * @enum {string}
         */
        ErrorCode: "VALIDATION_FAILED" | "INVALID_ID" | "INVALID_URL_PARAM" | "INVALID_BODY" | "BAD_REQUEST" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "ROUTE_NOT_FOUND" | "CONFLICT" | "TRANSACTION_CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE" | "RANGE_NOT_SATISFIABLE" | "TOO_MANY_REQUESTS" | "INTERNAL_ERROR" | "INVALID_CREDENTIALS" | "EMAIL_ALREADY_REGISTERED" | "LISTING_NOT_FOUND" | "INSPECTOR_NOT_FOUND" | "INSPECTOR_PROFILE_NOT_FOUND" | "APPOINTMENT_NOT_FOUND" | "INSPECTOR_PROFILE_EXISTS" | "INVALID_STATE" | "APPOINTMENT_EXPIRED" | "STATE_CHANGED" | "LISTING_HAS_PAID_APPOINTMENT" | "APPOINTMENT_DUPLICATE" | "SLOT_UNAVAILABLE" | "INSPECTOR_UNAVAILABLE" | "INSPECTOR_NOT_VERIFIED" | "PRICE_BELOW_MINIMUM" | "INVALID_SCHEDULE";
        ErrorResponseDto: {
            /**
             * @description Status HTTP
             * @example 404
             */
            statusCode: number;
            /**
             * @description Código do erro, estável e legível por máquina. O cliente decide por ele, não pela mensagem, que é texto para pessoas e pode mudar. A lista pode crescer; trate code desconhecido pelo status HTTP.
             * @example LISTING_NOT_FOUND
             */
            code: components["schemas"]["ErrorCode"];
            /**
             * @description Nome do status HTTP
             * @example Not Found
             */
            error: string;
            /** @example Anúncio não encontrado */
            message: string;
            /**
             * @description Lista de erros de validação (só em 400 de validação)
             * @example [
             *       "email must be an email"
             *     ]
             */
            errors?: string[];
            /**
             * @description URL da requisição, com a query string
             * @example /listings/123
             */
            path: string;
            /**
             * Format: date-time
             * @example 2026-11-10T12:00:00.000Z
             */
            timestamp: string;
        };
        RegisterDto: {
            /** @example Maria Silva */
            name: string;
            /** @example maria@email.com */
            email: string;
            /** @description No máximo 72 bytes em UTF-8 (acentos ocupam 2 bytes; emoji, 4) */
            password: string;
        };
        UserResponseDto: {
            /** Format: uuid */
            id: string;
            name: string;
            email: string;
            /** Format: date-time */
            createdAt: string;
        };
        LoginDto: {
            /** @example maria@email.com */
            email: string;
            /** @example senha12345 */
            password: string;
        };
        LoginResponseDto: {
            /** @description Enviar no header Authorization: Bearer <token> */
            accessToken: string;
            user: components["schemas"]["UserResponseDto"];
        };
        /**
         * @description Papel global do usuário na plataforma. A lista pode crescer; trate valor desconhecido sem quebrar.
         * @enum {string}
         */
        Role: "USER" | "INSPECTOR" | "ADMIN";
        CurrentUserResponseDto: {
            /** Format: uuid */
            id: string;
            name: string;
            email: string;
            /** Format: date-time */
            createdAt: string;
            /** @description Roles atuais do usuário, lidas do banco (uma mudança vale na hora, sem novo login) */
            roles: components["schemas"]["Role"][];
        };
        /**
         * @description Especialidade do avaliador.
         * @enum {string}
         */
        Specialty: "ENGINE" | "TRANSMISSION" | "SUSPENSION" | "BRAKES" | "ELECTRICAL" | "BODYWORK" | "AIR_CONDITIONING";
        /**
         * @description Sigla da UF (uma das 27)
         * @enum {string}
         */
        BrazilianState: "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO" | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";
        InspectorResponseDto: {
            /**
             * Format: uuid
             * @description Id do perfil do avaliador (não é id de usuário)
             */
            id: string;
            name: string;
            bio: string;
            specialties: components["schemas"]["Specialty"][];
            city: string;
            /**
             * @description Sigla da UF (uma das 27)
             * @example SP
             */
            state: components["schemas"]["BrazilianState"];
            /** @description Raio de atendimento em km */
            serviceRadiusKm: number;
            /** @description Preço base em centavos */
            basePriceCents: number;
            verified: boolean;
        };
        PaginatedInspectorsResponseDto: {
            items: components["schemas"]["InspectorResponseDto"][];
            /** @description Total de perfis verificados, em todas as páginas */
            total: number;
            page: number;
            limit: number;
        };
        CreateInspectorProfileDto: {
            /** @example Mecânico há 15 anos, especialista em câmbio. */
            bio: string;
            /**
             * @example [
             *       "ENGINE",
             *       "BRAKES"
             *     ]
             */
            specialties: components["schemas"]["Specialty"][];
            /** @example Barretos */
            city: string;
            /**
             * @description Sigla da UF (uma das 27). Espaços nas pontas e minúsculas são normalizados ("sp" vira "SP")
             * @example SP
             */
            state: components["schemas"]["BrazilianState"];
            /**
             * @description Raio de atendimento em km
             * @example 30
             */
            serviceRadiusKm: number;
            /**
             * @description Preço base em centavos (R$ 150,00 = 15000). Abaixo do mínimo da plataforma (MIN_INSPECTION_PRICE_CENTS, padrão R$ 50,00) responde 400
             * @example 15000
             */
            basePriceCents: number;
        };
        MyInspectorProfileResponseDto: {
            /**
             * Format: uuid
             * @description Id do perfil do avaliador (não é id de usuário)
             */
            id: string;
            name: string;
            bio: string;
            specialties: components["schemas"]["Specialty"][];
            city: string;
            /**
             * @description Sigla da UF (uma das 27)
             * @example SP
             */
            state: components["schemas"]["BrazilianState"];
            /** @description Raio de atendimento em km */
            serviceRadiusKm: number;
            /** @description Preço base em centavos */
            basePriceCents: number;
            verified: boolean;
            /**
             * @description Comissão atual da plataforma em pontos-base (1000 = 10%)
             * @example 1000
             */
            platformFeeBps: number;
            /**
             * @description Repasse estimado em centavos sobre o preço base, com a comissão atual
             * @example 13500
             */
            estimatedPayoutCents: number;
        };
        UpdateInspectorProfileDto: {
            /** @example Mecânico há 15 anos, especialista em câmbio. */
            bio?: string;
            /**
             * @example [
             *       "ENGINE",
             *       "BRAKES"
             *     ]
             */
            specialties?: components["schemas"]["Specialty"][];
            /** @example Barretos */
            city?: string;
            /**
             * @description Sigla da UF (uma das 27). Espaços nas pontas e minúsculas são normalizados ("sp" vira "SP")
             * @example SP
             */
            state?: components["schemas"]["BrazilianState"];
            /**
             * @description Raio de atendimento em km
             * @example 30
             */
            serviceRadiusKm?: number;
            /**
             * @description Preço base em centavos (R$ 150,00 = 15000). Abaixo do mínimo da plataforma (MIN_INSPECTION_PRICE_CENTS, padrão R$ 50,00) responde 400
             * @example 15000
             */
            basePriceCents?: number;
        };
        /**
         * @description Tipo de combustível do veículo.
         * @enum {string}
         */
        FuelType: "GASOLINE" | "ETHANOL" | "FLEX" | "DIESEL" | "ELECTRIC" | "HYBRID";
        /**
         * @description Tipo de câmbio do veículo.
         * @enum {string}
         */
        Transmission: "MANUAL" | "AUTOMATIC" | "CVT" | "AUTOMATED";
        VehicleResponseDto: {
            brand: string;
            model: string;
            /** @description Ano do veículo, de 1950 até o ano atual + 1 */
            year: number;
            /** @description Quilometragem */
            mileageKm: number;
            fuel: components["schemas"]["FuelType"];
            transmission: components["schemas"]["Transmission"];
        };
        ListingResponseDto: {
            /** Format: uuid */
            id: string;
            sellerName: string;
            title: string;
            description: string;
            /** @description Preço em centavos */
            priceCents: number;
            city: string;
            /**
             * @description Sigla da UF (uma das 27)
             * @example SP
             */
            state: components["schemas"]["BrazilianState"];
            vehicle: components["schemas"]["VehicleResponseDto"] | null;
            /** Format: date-time */
            createdAt: string;
        };
        PaginatedListingsResponseDto: {
            items: components["schemas"]["ListingResponseDto"][];
            total: number;
            page: number;
            limit: number;
        };
        /**
         * @description Status do anúncio.
         * @enum {string}
         */
        ListingStatus: "ACTIVE" | "SOLD" | "PAUSED" | "ARCHIVED";
        MyListingResponseDto: {
            /** Format: uuid */
            id: string;
            sellerName: string;
            title: string;
            description: string;
            /** @description Preço em centavos */
            priceCents: number;
            city: string;
            /**
             * @description Sigla da UF (uma das 27)
             * @example SP
             */
            state: components["schemas"]["BrazilianState"];
            vehicle: components["schemas"]["VehicleResponseDto"] | null;
            /** Format: date-time */
            createdAt: string;
            status: components["schemas"]["ListingStatus"];
        };
        PaginatedMyListingsResponseDto: {
            items: components["schemas"]["MyListingResponseDto"][];
            /** @description Total de anúncios do dono (sem os arquivados), em todas as páginas */
            total: number;
            page: number;
            limit: number;
        };
        VehicleDto: {
            /** @example Volkswagen */
            brand: string;
            /** @example Gol */
            model: string;
            /**
             * @description Ano do veículo, de 1950 até o ano atual + 1
             * @example 2018
             */
            year: number;
            /**
             * @description Quilometragem
             * @example 68000
             */
            mileageKm: number;
            fuel: components["schemas"]["FuelType"];
            transmission: components["schemas"]["Transmission"];
        };
        CreateListingDto: {
            /** @example Gol 1.0 2018 completo */
            title: string;
            /** @example Único dono, revisões em dia, pneus novos. */
            description: string;
            /**
             * @description Preço em centavos (R$ 45.000,00)
             * @example 4500000
             */
            priceCents: number;
            /** @example Boituva */
            city: string;
            /**
             * @description Sigla da UF (uma das 27). Espaços nas pontas e minúsculas são normalizados ("sp" vira "SP")
             * @example SP
             */
            state: components["schemas"]["BrazilianState"];
            vehicle: components["schemas"]["VehicleDto"];
        };
        UpdateListingDto: {
            /** @example Gol 1.0 2018 completo */
            title?: string;
            /** @example Único dono, revisões em dia, pneus novos. */
            description?: string;
            /**
             * @description Preço em centavos (R$ 45.000,00)
             * @example 4500000
             */
            priceCents?: number;
            /** @example Boituva */
            city?: string;
            /**
             * @description Sigla da UF (uma das 27). Espaços nas pontas e minúsculas são normalizados ("sp" vira "SP")
             * @example SP
             */
            state?: components["schemas"]["BrazilianState"];
            vehicle?: components["schemas"]["VehicleDto"];
        };
        /**
         * @description Estado do agendamento. A lista pode crescer; trate valor desconhecido sem quebrar.
         * @enum {string}
         */
        AppointmentStatus: "REQUESTED" | "ACCEPTED" | "AWAITING_PAYMENT" | "PAID" | "REPORT_SUBMITTED" | "DISPUTED" | "COMPLETED" | "DECLINED" | "CANCELLED" | "EXPIRED";
        AppointmentListingDto: {
            /** Format: uuid */
            id: string;
            title: string;
            city: string;
            /**
             * @description Sigla da UF (uma das 27)
             * @example SP
             */
            state: components["schemas"]["BrazilianState"];
        };
        AppointmentInspectorDto: {
            /**
             * Format: uuid
             * @description Id do perfil do avaliador (não é id de usuário)
             */
            profileId: string | null;
            name: string;
        };
        AppointmentPersonDto: {
            name: string;
        };
        /**
         * @description Quem executou uma ação no agendamento: comprador, vendedor, avaliador ou o sistema (expiração). A lista pode crescer; trate valor desconhecido sem quebrar.
         * @enum {string}
         */
        AppointmentActor: "BUYER" | "SELLER" | "INSPECTOR" | "SYSTEM";
        /**
         * @description Ação sobre o agendamento, uma por rota de intenção. A lista pode crescer; trate valor desconhecido sem quebrar.
         * @enum {string}
         */
        AppointmentAction: "ACCEPT" | "DECLINE" | "CONFIRM" | "CANCEL";
        BuyerAppointmentResponseDto: {
            /** Format: uuid */
            id: string;
            status: components["schemas"]["AppointmentStatus"];
            listing: components["schemas"]["AppointmentListingDto"];
            inspector: components["schemas"]["AppointmentInspectorDto"];
            buyer: components["schemas"]["AppointmentPersonDto"];
            seller: components["schemas"]["AppointmentPersonDto"];
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            /**
             * Format: date-time
             * @description Prazo da etapa atual
             */
            expiresAt: string | null;
            meetingAddress: string | null;
            /** @description Quem encerrou (recusa, cancelamento ou expiração) */
            endedBy: components["schemas"]["AppointmentActor"] | null;
            /** @description Ações que quem chama pode executar agora */
            availableActions: components["schemas"]["AppointmentAction"][];
            /** Format: date-time */
            createdAt: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            myRole: "BUYER";
            /** @description Preço da avaliação em centavos */
            priceCents: number;
        };
        SellerAppointmentResponseDto: {
            /** Format: uuid */
            id: string;
            status: components["schemas"]["AppointmentStatus"];
            listing: components["schemas"]["AppointmentListingDto"];
            inspector: components["schemas"]["AppointmentInspectorDto"];
            buyer: components["schemas"]["AppointmentPersonDto"];
            seller: components["schemas"]["AppointmentPersonDto"];
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            /**
             * Format: date-time
             * @description Prazo da etapa atual
             */
            expiresAt: string | null;
            meetingAddress: string | null;
            /** @description Quem encerrou (recusa, cancelamento ou expiração) */
            endedBy: components["schemas"]["AppointmentActor"] | null;
            /** @description Ações que quem chama pode executar agora */
            availableActions: components["schemas"]["AppointmentAction"][];
            /** Format: date-time */
            createdAt: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            myRole: "SELLER";
        };
        InspectorAppointmentResponseDto: {
            /** Format: uuid */
            id: string;
            status: components["schemas"]["AppointmentStatus"];
            listing: components["schemas"]["AppointmentListingDto"];
            inspector: components["schemas"]["AppointmentInspectorDto"];
            buyer: components["schemas"]["AppointmentPersonDto"];
            seller: components["schemas"]["AppointmentPersonDto"];
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            /**
             * Format: date-time
             * @description Prazo da etapa atual
             */
            expiresAt: string | null;
            meetingAddress: string | null;
            /** @description Quem encerrou (recusa, cancelamento ou expiração) */
            endedBy: components["schemas"]["AppointmentActor"] | null;
            /** @description Ações que quem chama pode executar agora */
            availableActions: components["schemas"]["AppointmentAction"][];
            /** Format: date-time */
            createdAt: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            myRole: "INSPECTOR";
            /** @description Preço pago pelo comprador, em centavos */
            priceCents: number;
            /** @description Comissão da plataforma em pontos-base, congelada na criação */
            platformFeeBps: number;
            /** @description Comissão da plataforma em centavos */
            platformFeeCents: number;
            /** @description Repasse ao avaliador em centavos (preço - comissão) */
            inspectorPayoutCents: number;
        };
        CreateAppointmentDto: {
            /**
             * Format: uuid
             * @description Id do anúncio (precisa estar ACTIVE)
             */
            listingId: string;
            /**
             * Format: uuid
             * @description Id do perfil do avaliador, como em GET /inspectors
             */
            inspectorProfileId: string;
            /**
             * @description Início da avaliação em ISO 8601 com fuso (Z ou ±hh:mm)
             * @example 2030-01-10T14:00:00.000Z
             */
            startsAt: string;
        };
        /**
         * @description Papel de um usuário num agendamento.
         * @enum {string}
         */
        AppointmentParticipant: "BUYER" | "SELLER" | "INSPECTOR";
        PaginatedAppointmentsResponseDto: {
            /** @description Cada item vem no formato do seu papel naquele agendamento (myRole) */
            items: components["schemas"]["AppointmentResponseDto"][];
            total: number;
            page: number;
            limit: number;
        };
        ConfirmAppointmentDto: {
            /** @example Rua das Flores, 123, Boituva/SP */
            meetingAddress: string;
        };
        AppointmentResponseDto: components["schemas"]["BuyerAppointmentResponseDto"] | components["schemas"]["SellerAppointmentResponseDto"] | components["schemas"]["InspectorAppointmentResponseDto"];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    registerUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDto"];
                };
            };
            /** @description Dados inválidos (lista em errors) ou corpo malformado */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description E-mail já cadastrado */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 5 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponseDto"];
                };
            };
            /** @description Dados inválidos (lista em errors) ou corpo malformado */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description E-mail ou senha inválidos */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 5 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    getCurrentUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description no-store: a resposta não deve ser guardada em cache */
                    "Cache-Control"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurrentUserResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado, ou token válido de uma conta que não existe mais */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    listInspectors: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Perfis verificados, paginados */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedInspectorsResponseDto"];
                };
            };
            /** @description Paginação inválida (page de 1 a 200, limit de 1 a 50) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    getMyInspectorProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Perfil do avaliador com a comissão atual e o repasse estimado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyInspectorProfileResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado, ou token válido de uma conta que não existe mais */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description "Sem permissão para esta ação": o usuário não tem a role INSPECTOR */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Perfil de avaliador não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    createMyInspectorProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateInspectorProfileDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InspectorResponseDto"];
                };
            };
            /** @description Dados inválidos ou preço base abaixo de MIN_INSPECTION_PRICE_CENTS */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description "Você já possui perfil de avaliador", ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    updateMyInspectorProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateInspectorProfileDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InspectorResponseDto"];
                };
            };
            /** @description Dados inválidos ou basePriceCents (quando enviado) abaixo de MIN_INSPECTION_PRICE_CENTS */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado, ou token válido de uma conta que não existe mais */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description "Sem permissão para esta ação": o usuário não tem a role INSPECTOR */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Perfil de avaliador não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    listListings: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
                brand?: string;
                city?: string;
                /** @description Sigla da UF (uma das 27). Espaços nas pontas e minúsculas são normalizados ("sp" vira "SP") */
                state?: components["schemas"]["BrazilianState"];
                /** @description Preço mínimo em centavos */
                minPriceCents?: number;
                /** @description Preço máximo em centavos */
                maxPriceCents?: number;
                /** @description Ano do veículo, de 1950 até o ano atual + 1 */
                minYear?: number;
                /** @description Ano do veículo, de 1950 até o ano atual + 1 */
                maxYear?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedListingsResponseDto"];
                };
            };
            /** @description Filtros inválidos (lista em errors): UF fora das 27, page de 1 a 200, limit de 1 a 50, faixas de preço e ano */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    createListing: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateListingDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyListingResponseDto"];
                };
            };
            /** @description Dados inválidos (lista em errors) ou corpo malformado */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    listMyListings: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Anúncios do usuário, sem os arquivados, paginados */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedMyListingsResponseDto"];
                };
            };
            /** @description Paginação inválida (page de 1 a 200, limit de 1 a 50) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    getListing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ListingResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    archiveListing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Anúncio arquivado (status ARCHIVED); não é apagado do banco. Os agendamentos em aberto do anúncio (REQUESTED, ACCEPTED, AWAITING_PAYMENT) são cancelados (CANCELLED, endedBy SELLER). */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Este anúncio não pertence a você */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio já arquivado, ou o status mudou durante a requisição, ou há avaliação paga em andamento (agendamento PAID), ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    updateListing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateListingDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyListingResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid, ou dados inválidos (inclusive enviar status, que muda só pelas rotas de transição) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Este anúncio não pertence a você */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio arquivado não pode ser alterado */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    pauseListing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Anúncio pausado (ACTIVE → PAUSED). Os agendamentos em aberto do anúncio (REQUESTED, ACCEPTED, AWAITING_PAYMENT) são cancelados (CANCELLED, endedBy SELLER). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyListingResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Este anúncio não pertence a você */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Ação não permitida no status atual do anúncio, ou o status mudou durante a requisição, ou há avaliação paga em andamento (agendamento PAID), ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    activateListing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Anúncio reativado (PAUSED → ACTIVE) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyListingResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Este anúncio não pertence a você */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Ação não permitida no status atual do anúncio, ou o status mudou durante a requisição, ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    markListingSold: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Anúncio marcado como vendido (ACTIVE ou PAUSED → SOLD). Os agendamentos em aberto do anúncio (REQUESTED, ACCEPTED, AWAITING_PAYMENT) são cancelados (CANCELLED, endedBy SELLER). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyListingResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Este anúncio não pertence a você */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio não encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Ação não permitida no status atual do anúncio, ou o status mudou durante a requisição, ou há avaliação paga em andamento (agendamento PAID), ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    listAppointments: {
        parameters: {
            query?: {
                /** @description Só os agendamentos em que você tem este papel */
                as?: components["schemas"]["AppointmentParticipant"];
                status?: components["schemas"]["AppointmentStatus"];
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedAppointmentsResponseDto"];
                };
            };
            /** @description Filtros inválidos (as, status, page, limit <= 50) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    createAppointment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAppointmentDto"];
            };
        };
        responses: {
            /** @description Pedido criado (REQUESTED); quem pede vira o comprador */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BuyerAppointmentResponseDto"];
                };
            };
            /** @description Dados inválidos (inclusive campos não permitidos como status, preço, comprador ou vendedor), antecedência mínima ou horizonte de 60 dias, ou corpo malformado */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Agendar no próprio anúncio, ou consigo mesmo como avaliador */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Anúncio não encontrado (ou não ACTIVE), ou avaliador não encontrado (ou não verificado) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Avaliador indisponível para o anúncio, preço abaixo do mínimo, horário ocupado ou pedido em andamento duplicado, ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 10 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    getAppointment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Formato conforme o seu papel (myRole) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppointmentResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Agendamento não encontrado (ou você não participa dele) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    acceptAppointment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Aceito (REQUESTED → ACCEPTED); ocupa o horário do avaliador */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InspectorAppointmentResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Você não pode aceitar este agendamento (só o avaliador) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Agendamento não encontrado (ou você não participa dele) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Estado não permite, prazo expirado, perfil não verificado, estado mudou ou horário não está mais disponível, ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    declineAppointment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Recusado (REQUESTED → DECLINED) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InspectorAppointmentResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Você não pode recusar este agendamento (só o avaliador) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Agendamento não encontrado (ou você não participa dele) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Estado não permite, prazo expirado ou estado mudou */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    confirmAppointment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmAppointmentDto"];
            };
        };
        responses: {
            /** @description Confirmado (ACCEPTED → AWAITING_PAYMENT); abre a janela de 30 min para pagar */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SellerAppointmentResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid, ou meetingAddress ausente ou fora de 5 a 300 caracteres, ou corpo malformado */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Você não pode confirmar este agendamento (só o vendedor) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Agendamento não encontrado (ou você não participa dele) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Estado não permite, prazo expirado ou estado mudou, ou "Conflito ao processar, tente novamente" (conflito de transação no banco; repita a requisição) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Corpo da requisição muito grande (acima de 100kb) */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Formato da requisição não suportado: Content-Type diferente de application/json ou application/x-www-form-urlencoded, ou Content-Encoding/charset não suportado. Vem antes da autenticação */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
    cancelAppointment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cancelado (antes do pagamento); formato conforme o seu papel */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppointmentResponseDto"];
                };
            };
            /** @description Identificador inválido: o id precisa ser uuid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Token ausente, inválido ou expirado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Agendamento não encontrado (ou você não participa dele) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Estado não permite (ex.: já pago ou encerrado), prazo expirado ou estado mudou */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Muitas requisições. Tente novamente em instantes. Limite: 100 requisições por minuto por IP. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
            /** @description Erro interno do servidor */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponseDto"];
                };
            };
        };
    };
}
