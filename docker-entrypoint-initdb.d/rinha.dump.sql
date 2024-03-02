SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public."Clientes" (
    "Id" integer NOT NULL,
    "Limite" integer NOT NULL,
    "SaldoInicial" integer NOT NULL
);

ALTER TABLE public."Clientes" OWNER TO postgres;

ALTER TABLE public."Clientes" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Clientes_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public."Transacoes" (
    "Id" integer NOT NULL,
    "Valor" integer NOT NULL,
    "ClienteId" integer NOT NULL,
    "Tipo" varchar(1) NOT NULL,
    "Descricao" text NOT NULL,
    "RealizadoEm" timestamp DEFAULT NOW()
);

ALTER TABLE public."Transacoes" OWNER TO postgres;

ALTER TABLE public."Transacoes" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Transacoes_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

COPY public."Clientes" ("Id", "Limite", "SaldoInicial") FROM stdin;
1	100000	0
2	80000	0
3	1000000	0
4	10000000	0
5	500000	0
\.

COPY public."Transacoes" ("Id", "Valor", "ClienteId", "Tipo", "Descricao", "RealizadoEm") FROM stdin;
\.

SELECT pg_catalog.setval('public."Clientes_Id_seq"', 1, false);

SELECT pg_catalog.setval('public."Transacoes_Id_seq"', 1, false);

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "PK_Clientes" PRIMARY KEY ("Id");

ALTER TABLE ONLY public."Transacoes"
    ADD CONSTRAINT "PK_Transacoes" PRIMARY KEY ("Id");

CREATE INDEX "IX_Transacoes_ClienteId" ON public."Transacoes" USING btree ("ClienteId");

ALTER TABLE ONLY public."Transacoes"
    ADD CONSTRAINT "FK_Transacoes_Clientes_ClienteId" FOREIGN KEY ("ClienteId") REFERENCES public."Clientes"("Id") ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.GetSaldoClienteById(IN id INTEGER)
RETURNS TABLE (
    Total INTEGER,
    Limite INTEGER,
    data_extrato TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY SELECT "SaldoInicial" AS Total, "Limite" AS Limite, NOW()::timestamp AS data_extrato FROM public."Clientes" WHERE "Id" = $1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.GetUltimasTransacoes(IN id INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT json_agg(t) FROM (
    SELECT "Valor" AS Valor, "Tipo" AS Tipo, "Descricao" AS Descricao, "RealizadoEm" AS RealizadoEm
    FROM public."Transacoes"
    WHERE "ClienteId" = $1
    ORDER BY "Id" DESC
    LIMIT 10
  ) AS t);
END;
$$ LANGUAGE plpgsql;