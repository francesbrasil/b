import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowRight, Check, X, MessageCircle, Loader2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Seo from '@/components/Seo';
import DiagnosticoForm from '@/components/DiagnosticoForm';
import apiServerClient from '@/lib/apiServerClient';

const WHATSAPP = 'https://wa.me/554188136623?text=Quero%20um%20diagn%C3%B3stico%20do%20meu%20perfil%21';

const passos = [
    {
        n: '01',
        titulo: 'Diagnóstico',
        texto: 'Você compartilha seu perfil do Instagram. A Inbre analisa seus Reels, identifica os problemas de edição que podem estar limitando seu alcance e monta um vídeo explicativo. Tudo em até 24 horas.',
    },
    {
        n: '02',
        titulo: 'Proposta',
        texto: 'Com o diagnóstico em mão, você decide se quer contratar um plano mensal. Cada faixa tem um volume de vídeos e um nível de entrega.',
    },
    {
        n: '03',
        titulo: 'Produção',
        texto: 'Você grava e envia o material bruto. A Inbre cuida do resto: gancho, corte, áudio, legenda, capa, cor e fonte.',
    },
];

const entrega = [
    'Gancho montado no corte de abertura',
    'Corte e ritmo do Reel inteiro',
    'Áudio tratado',
    'Legenda conferida palavra por palavra',
    'Capa padronizada',
    'Cor e fonte constantes de um vídeo para o outro',
];

const naoEntra = ['Gravação', 'Stories', 'Gestão do perfil'];

const planos = [
    {
        planId: 'essencial',
        nome: 'Essencial',
        volume: '10 vídeos por mês',
        preco: 'R$ 897,90',
        porVideo: 'R$ 87,79 por vídeo',
        diferenciais: ['1 revisão por vídeo', 'Desconto de 10% em relação ao avulso'],
        economia: {
            titulo: 'R$ 102,10 Economizados por mês',
            texto: 'R$ 1.000 no avulso − R$ 897,90 no plano',
        },
        destaque: false,
    },
    {
        planId: 'constante',
        nome: 'Constante',
        volume: '15 vídeos por mês',
        preco: 'R$ 1.273,90',
        porVideo: 'R$ 84,92 por vídeo',
        diferenciais: ['Até 3 revisões por vídeo', 'Desconto de 15% em relação ao avulso'],
        economia: {
            titulo: 'R$ 226,10 Economizados por mês',
            texto: 'R$ 1.500 no avulso − R$ 1.273,90 no plano',
        },
        destaque: false,
    },
    {
        planId: 'alto-volume',
        nome: 'Alto volume',
        volume: '25 vídeos por mês',
        preco: 'R$ 1.949,90',
        porVideo: 'R$ 77,99 por vídeo',
        diferenciais: ['Revisões ilimitadas', 'Criação de thumbnails grátis', 'Desconto de 22% em relação ao avulso'],
        economia: {
            titulo: 'R$ 1050,10 Economizados por mês',
            texto: 'R$ 3000 no avulso − R$ 1949,90 no plano',
        },
        destaque: true,
    },
];

const OFFICIAL_LOGO = 'https://horizons-cdn.hostinger.com/499cd8af-8b27-493a-b90e-3a76f07680bb/da2f2bf2eb28d4e120717939e8335a29.jpg';

const Logo = () => (
    <a href="#top" aria-label="Inbre, voltar ao topo" className="flex items-center">
        <img
            src={OFFICIAL_LOGO}
            alt="inbre"
            className="h-10 w-32 object-cover object-center mix-blend-screen"
        />
    </a>
);

const HomePage = () => {
    const [checkoutPlan, setCheckoutPlan] = useState(null);
    const [checkoutError, setCheckoutError] = useState('');

    const handleCheckout = async (planId) => {
        if (checkoutPlan) return;
        setCheckoutPlan(planId);
        setCheckoutError('');

        try {
            const response = await apiServerClient.fetch('/mercadopago/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Não foi possível iniciar o checkout.');
            }

            if (data?.checkoutUrl) {
                window.location.href = data.checkoutUrl;
                return;
            }

            throw new Error('Não foi possível iniciar o checkout.');
        } catch (err) {
            setCheckoutPlan(null);
            setCheckoutError(
                'Não foi possível abrir o pagamento agora. Tente novamente em alguns instantes ou fale com a gente no WhatsApp.',
            );
        }
    };

    return (
        <div id="top" className="grain min-h-screen bg-background">
            <Helmet>
                <title>Inbre | Estúdio de edição de Reels para nutricionistas e personal trainers</title>
                <meta
                    name="description"
                    content="A Inbre edita Reels para nutricionistas e personal trainers. Diagnóstico gratuito em vídeo em até 24 horas mostrando o que limita o alcance do seu conteúdo."
                />
            </Helmet>
            <Seo
                title="Inbre | Edição de Reels para nutricionistas e personal trainers"
                description="Diagnóstico gratuito em vídeo em até 24 horas sobre a edição dos seus Reels."
                siteName="Inbre"
            />

            <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center justify-between px-5 sm:px-8">
                    <Logo />
                    <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
                        <a href="#como-funciona" className="link-hover">Como funciona</a>
                        <a href="#servico" className="link-hover">Serviço</a>
                        <a href="#planos" className="link-hover">Planos</a>
                        <a href="#sobre" className="link-hover">Sobre</a>
                    </nav>
                    <a
                        href="#diagnostico"
                        className="btn-primary-hover inline-flex h-10 items-center rounded-full bg-primary px-5 text-xs font-bold uppercase tracking-widest text-primary-foreground"
                    >
                        Diagnóstico
                    </a>
                </div>
            </header>

            <main>
                {/* HERO */}
                <section className="relative overflow-hidden border-b border-border">
                    <div className="pointer-events-none absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="relative mx-auto grid w-full max-w-[80rem] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
                        <div>
                            <Reveal>
                                <img
                                    src={OFFICIAL_LOGO}
                                    alt="Logo oficial Inbre"
                                    className="mb-7 h-14 w-44 object-cover object-center mix-blend-screen sm:h-16 sm:w-52"
                                />
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                    Edição de Reels
                                </p>
                            </Reveal>
                            <Reveal delay={0.05}>
                                <h1 className="font-display mt-6 text-[2.6rem] leading-[0.98] sm:text-6xl lg:text-[4.4rem]">
                                    Seu conteúdo é bom.
                                    <br />
                                    <span className="relative inline-block">
                                        <span className="relative z-10">A edição está abaixo dele.</span>
                                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 bg-primary/70" />
                                    </span>
                                </h1>
                            </Reveal>
                            <Reveal delay={0.12}>
                                <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                    Nutricionistas e personal trainers perdem alcance por edição mal executada. A Inbre
                                    analisa seu perfil e monta um diagnóstico em vídeo mostrando exatamente o que está
                                    limitando seu alcance.
                                </p>
                            </Reveal>
                            <Reveal delay={0.18}>
                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href="#diagnostico"
                                        className="btn-primary-hover group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-9 text-sm font-bold uppercase tracking-widest text-primary-foreground"
                                    >
                                        Diagnóstico gratuito em 24 horas
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                                    </a>
                                    <a
                                        href={WHATSAPP}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-outline-hover inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border px-9 text-sm font-semibold uppercase tracking-widest text-foreground"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </a>
                                </div>
                            </Reveal>
                            <Reveal delay={0.24}>
                                <p className="mt-8 max-w-xl border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted-foreground">
                                    Você compartilha seu perfil do Instagram. A Inbre analisa, monta um vídeo explicando
                                    os problemas de edição que estão desperdiçando seu conteúdo e devolve tudo em até 24
                                    horas. Sem custo.
                                </p>
                            </Reveal>
                        </div>

                        <Reveal delay={0.1} y={32}>
                            <div className="relative">
                                <img
                                    src="https://images.hostinger.com/3aa04c75-c014-45b7-8e26-9a7edf8156fa.png"
                                    alt="Personal trainer gravando um Reel com celular em tripé"
                                    className="aspect-[3/4] w-full object-cover"
                                    loading="lazy"
                                />
                                <img
                                    src="https://images.hostinger.com/6e52e247-d29c-4dd2-907b-9b61b08083ce.png"
                                    alt="Nutricionista gravando vídeo vertical na cozinha do consultório"
                                    className="absolute -bottom-8 -left-6 hidden aspect-[3/4] w-40 border-4 border-background object-cover sm:block lg:w-48"
                                    loading="lazy"
                                />
                            </div>
                        </Reveal>
                    </div>

                </section>

                {/* COMO FUNCIONA */}
                <section id="como-funciona" className="border-b border-border">
                    <div className="mx-auto w-full max-w-[72rem] px-5 py-20 sm:px-8 lg:py-28">
                        <Reveal>
                            <h2 className="font-display text-3xl sm:text-4xl">Como funciona</h2>
                        </Reveal>
                        <div className="mt-12 divide-y divide-border border-t border-border">
                            {passos.map((passo, index) => (
                                <Reveal key={passo.n} delay={index * 0.08}>
                                    <div className="grid gap-4 py-9 sm:grid-cols-[6rem_1fr] sm:gap-10">
                                        <span className="font-display text-4xl text-primary">{passo.n}</span>
                                        <div>
                                            <h3 className="font-display text-xl">{passo.titulo}</h3>
                                            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                                                {passo.texto}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SERVIÇO */}
                <section id="servico" className="border-b border-border bg-card">
                    <div className="mx-auto grid w-full max-w-[80rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
                        <Reveal>
                            <div>
                                <h2 className="font-display text-3xl sm:text-4xl">O que entra no serviço</h2>
                                <ul className="mt-9 space-y-4">
                                    {entrega.map((item) => (
                                        <li key={item} className="flex items-start gap-3 border-b border-border/70 pb-4">
                                            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
                                            <span className="text-base">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                        Não entra
                                    </p>
                                    <ul className="mt-4 flex flex-wrap gap-3">
                                        {naoEntra.map((item) => (
                                            <li
                                                key={item}
                                                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted-foreground"
                                            >
                                                <X className="h-4 w-4" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1} y={28}>
                            <img
                                src="https://images.hostinger.com/955fff2d-d94d-4e5b-8717-0d48cf4bfa6f.png"
                                alt="Timeline de edição de vídeo em um estúdio caseiro"
                                className="h-full min-h-[20rem] w-full object-cover"
                                loading="lazy"
                            />
                        </Reveal>
                    </div>
                </section>

                {/* PLANOS */}
                <section id="planos" className="border-b border-border">
                    <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 lg:py-28">
                        <Reveal>
                            <h2 className="font-display text-3xl sm:text-4xl">Planos</h2>
                            <p className="mt-4 max-w-2xl text-muted-foreground">
                                Escolha o volume que combina com sua rotina de gravação e conte com uma edição consistente
                                em todos os seus Reels.
                            </p>
                            <p className="mt-3 text-sm font-semibold text-foreground">
                                Preço do vídeo avulso: R$ 100,00
                            </p>
                        </Reveal>
                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {planos.map((plano, index) => (
                                <Reveal key={plano.nome} delay={index * 0.08}>
                                    <div
                                        className={`card-hover flex h-full flex-col border p-7 ${
                                            plano.destaque
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border bg-card'
                                        }`}
                                    >
                                        {plano.destaque ? (
                                            <span className="mb-4 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-primary-foreground">
                                                Mais procurado
                                            </span>
                                        ) : null}
                                        <h3 className="font-display text-2xl">{plano.nome}</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">{plano.volume}</p>
                                        <p className="font-display mt-6 text-3xl text-primary">{plano.preco}</p>
                                        <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                                            por mês
                                        </p>
                                        <p className="mt-3 text-sm font-semibold text-foreground">{plano.porVideo}</p>
                                        <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                                            {plano.diferenciais.map((item, i) => (
                                                <li key={`${plano.nome}-${i}`} className="flex items-start gap-2">
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        {plano.economia ? (
                                            <div className="mt-6 border border-primary/45 bg-primary/10 p-4">
                                                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
                                                    Economia no plano
                                                </p>
                                                <p className="font-display mt-2 text-2xl text-primary">{plano.economia.titulo}</p>
                                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{plano.economia.texto}</p>
                                            </div>
                                        ) : null}
                                        <div className="mt-8 grid gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleCheckout(plano.planId)}
                                                disabled={checkoutPlan === plano.planId}
                                                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold uppercase tracking-widest disabled:opacity-70 ${
                                                    plano.destaque
                                                        ? 'btn-primary-hover bg-primary text-primary-foreground'
                                                        : 'btn-outline-hover border border-border text-foreground'
                                                }`}
                                            >
                                                {checkoutPlan === plano.planId ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : null}
                                                Contratar plano
                                            </button>
                                            <a
                                                href={WHATSAPP}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="wa-link inline-flex h-11 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                                Conversar antes
                                            </a>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                        {checkoutError ? (
                            <p className="mt-6 text-sm text-primary">{checkoutError}</p>
                        ) : null}
                    </div>
                </section>
                <section id="sobre" className="border-b border-border bg-card">
                    <div className="mx-auto w-full max-w-[56rem] px-5 py-20 sm:px-8 lg:py-28">
                        <Reveal>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Sobre</p>
                            <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground">
                                <p>A Inbre nasceu de uma conclusão prática sobre edição de vídeo.</p>
                                <p>
                                    Comecei em 2022, editando os próprios vídeos. Ficou claro que a edição mudava o
                                    resultado de um jeito grande demais para ser ignorado, e passei a editar para outras
                                    pessoas.
                                </p>
                                <p>
                                    Nos anos seguintes atendi nichos que não tinham nada a ver um com o outro. E aí
                                    apareceu o problema: cada mercado tem uma lógica própria. O que prende a atenção em um
                                    não prende no outro, porque gancho, ritmo e jeito de falar mudam conforme o público.
                                    Atender muitos ao mesmo tempo significa entregar razoável em todos em vez de forte em
                                    algum.
                                </p>
                                <p>
                                    A Inbre é a resposta a isso. Um mercado só, escolhido porque acompanhamos nutrição e
                                    fitness há anos e já sabemos o que costuma funcionar aqui: o que faz a pessoa parar de
                                    rolar, o que faz ela salvar o vídeo e o que faz ela marcar a consulta.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* CONTATO */}
                <section id="diagnostico" className="border-b border-border">
                    <div className="mx-auto grid w-full max-w-[80rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
                        <Reveal>
                            <div>
                                <h2 className="font-display text-3xl sm:text-4xl">
                                    Diagnóstico gratuito
                                    <br />
                                    em 24 horas
                                </h2>
                                <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                                    Envie seu nome, email e perfil do Instagram. A Inbre analisa seus Reels e devolve um
                                    vídeo com os pontos de edição que estão limitando seu alcance.
                                </p>
                                <a
                                    href={WHATSAPP}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-outline-hover mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-border px-7 text-sm font-semibold uppercase tracking-widest text-foreground"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Falar no WhatsApp
                                </a>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <DiagnosticoForm />
                        </Reveal>
                    </div>
                </section>
            </main>

            <footer className="mx-auto w-full max-w-[80rem] px-5 py-12 sm:px-8">
                <div className="flex flex-col items-start justify-between gap-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
                    <Logo />
                    <div className="flex flex-wrap gap-6">
                        <a href="#como-funciona" className="link-hover">Como funciona</a>
                        <a href="#planos" className="link-hover">Planos</a>
                        <a href="#diagnostico" className="link-hover">Diagnóstico</a>
                        <a
                            href={WHATSAPP}
                            target="_blank"
                            rel="noreferrer"
                            className="wa-link inline-flex items-center gap-2"
                        >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                        </a>
                    </div>
                    <p>Inbre {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
