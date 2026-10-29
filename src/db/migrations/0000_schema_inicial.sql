CREATE TYPE "public"."origem_voto" AS ENUM('documento', 'mesa');--> statement-breakpoint
CREATE TYPE "public"."papel_admin" AS ENUM('operador', 'god');--> statement-breakpoint
CREATE TYPE "public"."status_eleicao" AS ENUM('rascunho', 'aberta', 'encerrada', 'publicada');--> statement-breakpoint
CREATE TYPE "public"."status_voto" AS ENUM('valido', 'anulado');--> statement-breakpoint
CREATE TABLE "apartamento" (
	"id" serial PRIMARY KEY NOT NULL,
	"empreendimento_id" integer NOT NULL,
	"bloco" text NOT NULL,
	"numero" text NOT NULL,
	"rotulo" text NOT NULL,
	CONSTRAINT "apartamento_empreendimento_id_bloco_numero_unique" UNIQUE("empreendimento_id","bloco","numero")
);
--> statement-breakpoint
CREATE TABLE "candidato" (
	"id" serial PRIMARY KEY NOT NULL,
	"eleicao_id" integer NOT NULL,
	"nome" text NOT NULL,
	"apartamento_id" integer,
	"foto" text,
	"proposta" text,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comprador" (
	"id" serial PRIMARY KEY NOT NULL,
	"apartamento_id" integer NOT NULL,
	"nome" text NOT NULL,
	"documento" varchar(14)
);
--> statement-breakpoint
CREATE TABLE "eleicao" (
	"id" serial PRIMARY KEY NOT NULL,
	"empreendimento_id" integer NOT NULL,
	"codigo" text NOT NULL,
	"titulo" text NOT NULL,
	"status" "status_eleicao" DEFAULT 'rascunho' NOT NULL,
	"teste" boolean DEFAULT false NOT NULL,
	"aberta_em" timestamp with time zone,
	"encerrada_em" timestamp with time zone,
	CONSTRAINT "eleicao_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "empreendimento" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "log_auditoria" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"eleicao_id" integer,
	"usuario_id" integer,
	"acao" text NOT NULL,
	"alvo" text,
	"motivo" text,
	"dados" jsonb,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "situacao_apartamento" (
	"eleicao_id" integer NOT NULL,
	"apartamento_id" integer NOT NULL,
	"tentativas_falhas" integer DEFAULT 0 NOT NULL,
	"bloqueado" boolean DEFAULT false NOT NULL,
	CONSTRAINT "situacao_apartamento_eleicao_id_apartamento_id_pk" PRIMARY KEY("eleicao_id","apartamento_id")
);
--> statement-breakpoint
CREATE TABLE "usuario_admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text NOT NULL,
	"papel" "papel_admin" NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "usuario_admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "voto" (
	"id" serial PRIMARY KEY NOT NULL,
	"eleicao_id" integer NOT NULL,
	"apartamento_id" integer NOT NULL,
	"candidato_id" integer NOT NULL,
	"comprador_id" integer,
	"documento" varchar(14) NOT NULL,
	"nome" text NOT NULL,
	"origem" "origem_voto" NOT NULL,
	"comprovante" text NOT NULL,
	"status" "status_voto" DEFAULT 'valido' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "voto_comprovante_unique" UNIQUE("comprovante")
);
--> statement-breakpoint
ALTER TABLE "apartamento" ADD CONSTRAINT "apartamento_empreendimento_id_empreendimento_id_fk" FOREIGN KEY ("empreendimento_id") REFERENCES "public"."empreendimento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidato" ADD CONSTRAINT "candidato_eleicao_id_eleicao_id_fk" FOREIGN KEY ("eleicao_id") REFERENCES "public"."eleicao"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidato" ADD CONSTRAINT "candidato_apartamento_id_apartamento_id_fk" FOREIGN KEY ("apartamento_id") REFERENCES "public"."apartamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comprador" ADD CONSTRAINT "comprador_apartamento_id_apartamento_id_fk" FOREIGN KEY ("apartamento_id") REFERENCES "public"."apartamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eleicao" ADD CONSTRAINT "eleicao_empreendimento_id_empreendimento_id_fk" FOREIGN KEY ("empreendimento_id") REFERENCES "public"."empreendimento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_auditoria" ADD CONSTRAINT "log_auditoria_eleicao_id_eleicao_id_fk" FOREIGN KEY ("eleicao_id") REFERENCES "public"."eleicao"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_auditoria" ADD CONSTRAINT "log_auditoria_usuario_id_usuario_admin_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario_admin"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "situacao_apartamento" ADD CONSTRAINT "situacao_apartamento_eleicao_id_eleicao_id_fk" FOREIGN KEY ("eleicao_id") REFERENCES "public"."eleicao"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "situacao_apartamento" ADD CONSTRAINT "situacao_apartamento_apartamento_id_apartamento_id_fk" FOREIGN KEY ("apartamento_id") REFERENCES "public"."apartamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voto" ADD CONSTRAINT "voto_eleicao_id_eleicao_id_fk" FOREIGN KEY ("eleicao_id") REFERENCES "public"."eleicao"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voto" ADD CONSTRAINT "voto_apartamento_id_apartamento_id_fk" FOREIGN KEY ("apartamento_id") REFERENCES "public"."apartamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voto" ADD CONSTRAINT "voto_candidato_id_candidato_id_fk" FOREIGN KEY ("candidato_id") REFERENCES "public"."candidato"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voto" ADD CONSTRAINT "voto_comprador_id_comprador_id_fk" FOREIGN KEY ("comprador_id") REFERENCES "public"."comprador"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comprador_documento" ON "comprador" USING btree ("documento");--> statement-breakpoint
CREATE UNIQUE INDEX "um_voto_por_apto" ON "voto" USING btree ("eleicao_id","apartamento_id") WHERE "voto"."status" = 'valido';