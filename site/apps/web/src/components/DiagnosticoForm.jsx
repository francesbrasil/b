import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const initial = { nome: '', email: '', instagram: '', mensagem: '' };

const DiagnosticoForm = () => {
    const [form, setForm] = useState(initial);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

    const onSubmit = async (event) => {
        event.preventDefault();
        setStatus('loading');
        setError('');

        try {
            await pb.collection('diagnosticos').create(form);
            setStatus('done');
            setForm(initial);
        } catch (err) {
            setStatus('idle');
            setError('Não foi possível enviar agora. Tente novamente em alguns instantes.');
        }
    };

    if (status === 'done') {
        return (
            <div className="border border-primary/40 bg-primary/10 p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <Check className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <h3 className="font-display mt-5 text-2xl">Pedido recebido</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Vou analisar o perfil e enviar o vídeo de diagnóstico no email informado em até 24 horas.
                </p>
                <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm font-semibold uppercase tracking-widest text-primary"
                >
                    Enviar outro perfil
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-5">
                <div className="grid gap-2">
                    <label htmlFor="nome" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Nome
                    </label>
                    <input
                        id="nome"
                        required
                        value={form.nome}
                        onChange={update('nome')}
                        placeholder="Como devo te chamar"
                        className="h-12 w-full border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={update('email')}
                        placeholder="seu@email.com"
                        className="h-12 w-full border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="instagram" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Perfil do Instagram
                    </label>
                    <input
                        id="instagram"
                        required
                        value={form.instagram}
                        onChange={update('instagram')}
                        placeholder="@seuperfil"
                        className="h-12 w-full border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="mensagem" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Contexto (opcional)
                    </label>
                    <textarea
                        id="mensagem"
                        rows={3}
                        value={form.mensagem}
                        onChange={update('mensagem')}
                        placeholder="Frequência de postagem, objetivo, dúvidas"
                        className="w-full border border-input bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                    />
                </div>
            </div>

            {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}

            <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary-hover mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-70"
            >
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Solicitar diagnóstico gratuito
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Resposta em até 24 horas. Sem custo.</p>
        </form>
    );
};

export default DiagnosticoForm;
