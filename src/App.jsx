import { useState, useEffect, useRef } from "react";

const PLANS = [
  {
    id: "essencial",
    name: "Essencial",
    price: 97,
    desc: "Para profissionais que precisam de análises rápidas e confiáveis.",
    features: [
      "100 consultas por mês",
      "Ranking completo de municípios",
      "Score MuniScore + CAPAG detalhado",
      "Comparativo entre 2 municípios",
      "Panorama nacional e regional",
      "Exportação em PDF",
      "Suporte por e-mail",
    ],
    cta: "Começar agora",
    popular: false,
  },
  {
    id: "profissional",
    name: "Profissional",
    price: 247,
    desc: "Para equipes e operações que exigem inteligência fiscal completa.",
    features: [
      "Consultas ilimitadas",
      "Tudo do plano Essencial",
      "Exportação em PDF + Excel",
      "Alertas de mudança fiscal",
      "Monitoramento de municípios",
      "Comparativos ilimitados",
      "Suporte prioritário",
      "Atualizações em tempo real",
    ],
    cta: "Quero o Profissional",
    popular: true,
  },
];

const PAIN_POINTS = [
  {
    icon: "⚠️",
    title: "Contratos com municípios insolventes",
    desc: "Empresas perdem milhões ao firmar contratos com prefeituras que não conseguem honrar pagamentos.",
  },
  {
    icon: "🔍",
    title: "Dados fiscais espalhados e confusos",
    desc: "Informações em dezenas de relatórios do Tesouro Nacional que ninguém tem tempo de cruzar manualmente.",
  },
  {
    icon: "⏱️",
    title: "Semanas para uma due diligence",
    desc: "Análises que deveriam levar minutos consomem semanas de trabalho — tempo que custa dinheiro.",
  },
];

const FEATURES = [
  {
    icon: "📊",
    title: "Score MuniScore",
    desc: "Algoritmo exclusivo que cruza dados de receita, despesa, endividamento e capacidade de pagamento em uma nota de 0 a 1000.",
  },
  {
    icon: "⚡",
    title: "Análise em Segundos",
    desc: "Busque qualquer município e tenha o diagnóstico fiscal completo instantaneamente.",
  },
  {
    icon: "⚖️",
    title: "Comparativo Direto",
    desc: "Compare municípios lado a lado em todas as dimensões fiscais. Ideal para decidir entre oportunidades.",
  },
  {
    icon: "🔔",
    title: "Alertas Inteligentes",
    desc: "Seja notificado quando a situação fiscal de um município que você monitora mudar significativamente.",
  },
  {
    icon: "📄",
    title: "Relatórios Exportáveis",
    desc: "Gere relatórios em PDF e Excel prontos para anexar em análises, propostas e processos licitatórios.",
  },
  {
    icon: "🗺️",
    title: "Mapa Interativo",
    desc: "Visualize a saúde fiscal de todo o Brasil em um mapa por estado, com drill-down até o município.",
  },
];

const TESTIMONIALS = [
  {
    text: "Reduziu nosso tempo de análise de risco municipal de 2 semanas para 5 minutos. Indispensável.",
    author: "Diretor de Operações",
    role: "Consultoria de Crédito Público",
  },
  {
    text: "Antes de licitar, consultamos o MuniScore. Já evitamos contratos com municípios que entraram em colapso fiscal.",
    author: "Gerente Comercial",
    role: "Fornecedor de Equipamentos",
  },
  {
    text: "A visão consolidada e os alertas nos permitem agir rápido quando uma oportunidade ou risco aparece.",
    author: "Analista de Investimentos",
    role: "Fundo de Infraestrutura",
  },
];

const FAQ = [
  {
    q: "De onde vêm os dados?",
    a: "Todos os dados são extraídos diretamente das APIs oficiais do Tesouro Nacional, incluindo relatórios fiscais e notas de capacidade de pagamento. São os mesmos dados usados pelo governo federal.",
  },
  {
    q: "Com que frequência os dados são atualizados?",
    a: "O sistema busca automaticamente os dados mais recentes disponibilizados pelo Tesouro Nacional. A frequência depende da publicação oficial, mas nossa plataforma sincroniza continuamente.",
  },
  {
    q: "O que acontece após os 7 dias de teste?",
    a: "Seu acesso é pausado até a escolha de um plano. Nenhuma cobrança é feita sem sua autorização. Seus dados e configurações ficam salvos.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. A assinatura é mensal sem fidelidade. Cancele quando quiser, sem burocracia.",
  },
  {
    q: "Quantos municípios estão na plataforma?",
    a: "Todos os municípios brasileiros que efetivaram suas entregas ao Tesouro Nacional — atualmente mais de 5.500 municípios com dados completos.",
  },
  {
    q: "Posso usar para processos licitatórios?",
    a: "Sim. Os relatórios exportáveis são ideais para subsidiar análises de risco em licitações, contratos administrativos e operações de crédito.",
  },
  {
    q: "Como o Score MuniScore é calculado?",
    a: "Todos os dados utilizados são oriundos de portais de informações públicas. O sistema utiliza uma inteligência proprietária para definir, com base nas informações disponibilizadas, o Score de cada município. O Score serve única e exclusivamente para ilustrar a situação fiscal daquele órgão, não garantindo e nem se responsabilizando por ações dos órgãos públicos ou de seus servidores.",
  },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function Section({ children, className, id }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  return (
    <section
      ref={ref}
      id={id}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </section>
  );
}

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const C = {
    bg: "#03060d",
    sf: "#080e1c",
    sf2: "#0c1424",
    bd: "#152038",
    tx: "#eaf0f8",
    txs: "#b8c5d6",
    tm: "#7a8da4",
    accent: "#00e88f",
    accent2: "#00c878",
    accentDark: "#00a060",
    gold: "#fbbf24",
    red: "#ff4d4d",
    blue: "#3b82f6",
  };

  return (
    <div style={{ background: C.bg, color: C.tx, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; }
        ::selection { background: ${C.accent}33; color: #fff; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .6; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px ${C.accent}22; } 50% { box-shadow: 0 0 40px ${C.accent}44; } }
        .cta-btn { animation: glow 3s ease-in-out infinite; }
        .cta-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 30px ${C.accent}55 !important; }
      `}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? `${C.bg}ee` : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.bd}` : "none",
          transition: "all .3s ease",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 22 }}>
            <span style={{ color: C.accent }}>Muni</span>
            <span style={{ color: "#fff" }}>Score</span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["#demo", "Demo"], ["#features", "Recursos"], ["#pricing", "Planos"], ["#faq", "FAQ"]].map(([h, l]) => (
              <a key={h} href={h} style={{ color: C.tm, textDecoration: "none", fontSize: 14, fontFamily: "DM Sans", fontWeight: 500, transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = C.accent}
                onMouseLeave={e => e.target.style.color = C.tm}>{l}</a>
            ))}
            <a href="https://muniscore-brasil-ztvo.vercel.app/" target="_blank" rel="noopener"
              style={{
                background: C.accent, color: C.bg, padding: "8px 20px", borderRadius: 8,
                fontSize: 13, fontWeight: 700, fontFamily: "DM Sans", textDecoration: "none",
                transition: "all .2s",
              }}
              onMouseEnter={e => { e.target.style.background = C.accent2; e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.target.style.background = C.accent; e.target.style.transform = "translateY(0)"; }}
            >Testar grátis por 7 dias</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        position: "relative", paddingTop: 140, paddingBottom: 100,
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${C.accent}08, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 20%, ${C.blue}06, transparent), ${C.bg}`,
      }}>
        {/* Decorative grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.bd}22 1px, transparent 1px), linear-gradient(90deg, ${C.bd}22 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4 }} />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${C.accent}12`, border: `1px solid ${C.accent}33`, borderRadius: 99,
            padding: "6px 16px", marginBottom: 28, fontSize: 13, fontFamily: "DM Sans", fontWeight: 600, color: C.accent,
            animation: "slideUp .6s ease",
          }}>
            <span style={{ animation: "pulse 2s infinite" }}>●</span> Plataforma de inteligência fiscal municipal
          </div>

          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900, fontSize: "clamp(36px, 5.5vw, 72px)",
            lineHeight: 1.05, maxWidth: 900, margin: "0 auto 24px",
            background: `linear-gradient(135deg, #fff 30%, ${C.accent} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "slideUp .6s ease .1s both",
          }}>
            Não assine contratos<br />no escuro
          </h1>

          <p style={{
            fontFamily: "DM Sans", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.6,
            color: C.txs, maxWidth: 620, margin: "0 auto 40px",
            animation: "slideUp .6s ease .2s both",
          }}>
            Saiba a real situação fiscal de qualquer município brasileiro em segundos.
            Score MuniScore, CAPAG, indicadores financeiros — tudo em um só lugar.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "slideUp .6s ease .3s both" }}>
            <a href="https://muniscore-brasil-ztvo.vercel.app/" target="_blank" rel="noopener" className="cta-btn" style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color: C.bg,
              padding: "16px 36px", borderRadius: 12, fontSize: 16, fontWeight: 800,
              fontFamily: "Outfit", textDecoration: "none", transition: "all .3s",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Testar grátis por 7 dias <span style={{ fontSize: 20 }}>→</span>
            </a>
            <a href="#demo" style={{
              background: "transparent", color: C.txs,
              padding: "16px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600,
              fontFamily: "DM Sans", textDecoration: "none", transition: "all .2s",
              border: `1px solid ${C.bd}`,
            }}
              onMouseEnter={e => { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; }}
              onMouseLeave={e => { e.target.style.borderColor = C.bd; e.target.style.color = C.txs; }}
            >
              Ver demonstração
            </a>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap",
            animation: "slideUp .6s ease .4s both",
          }}>
            {[
              { n: "5.500+", l: "Municípios analisados" },
              { n: "< 5s", l: "Tempo de análise" },
              { n: "100%", l: "Dados oficiais" },
            ].map(x => (
              <div key={x.l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 32, color: C.accent }}>{x.n}</div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, color: C.tm, marginTop: 4 }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DEMO ── */}
      <Section id="demo">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", marginBottom: 16 }}>
              Conheça a plataforma <span style={{ color: C.accent }}>por dentro</span>
            </h2>
            <p style={{ fontFamily: "DM Sans", color: C.tm, fontSize: 16, maxWidth: 550, margin: "0 auto" }}>
              Veja como o MuniScore transforma dados públicos em inteligência acionável.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                title: "Página Inicial",
                desc: "Mapa interativo do Brasil colorido por score médio de cada estado. Busque qualquer município instantaneamente, veja estatísticas gerais e acesse o ranking com um clique.",
                icon: "🗺️",
                features: ["Mapa interativo por estado", "Busca com autocomplete", "Cards de estatísticas", "Classificação geral"],
                color: C.accent,
              },
              {
                title: "Ranking Completo",
                desc: "Todos os municípios ordenados por score fiscal, com filtros por UF, região, classificação, CAPAG e porte. Paginação inteligente e ordenação por qualquer coluna.",
                icon: "📊",
                features: ["Filtros avançados", "Ordenação dinâmica", "Score + CAPAG + Classificação", "Status de entrega"],
                color: C.blue,
              },
              {
                title: "Visão Geral do Município",
                desc: "Diagnóstico fiscal completo: gauge de score, radar de dimensões, detalhamento de receitas e despesas, notas CAPAG individuais e indicadores financeiros.",
                icon: "🔍",
                features: ["Gauge de score visual", "Radar de 4 dimensões", "CAPAG detalhado", "Indicadores financeiros"],
                color: "#f59e0b",
              },
              {
                title: "Comparativo",
                desc: "Selecione dois municípios e compare lado a lado: scores por dimensão, indicadores, CAPAG e classificação. Ideal para decidir entre oportunidades.",
                icon: "⚖️",
                features: ["Comparação lado a lado", "Barras por dimensão", "Tabela de indicadores", "Gauges individuais"],
                color: "#8b5cf6",
              },
              {
                title: "Panorama Nacional",
                desc: "Visão macro: distribuição por score e CAPAG, médias regionais, top 10 e piores 10. Gráficos interativos com tooltips detalhados.",
                icon: "📈",
                features: ["Gráficos de pizza", "Média por região", "Top 10 e piores 10", "Distribuição por CAPAG"],
                color: "#ef4444",
              },
            ].map((screen, i) => (
              <div key={i} style={{
                display: "flex", gap: 32, alignItems: "center",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                background: `linear-gradient(135deg, ${C.sf}, ${C.sf2})`,
                border: `1px solid ${C.bd}`, borderRadius: 20, padding: 32,
                transition: "all .3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${screen.color}44`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Mockup */}
                <div style={{ flex: "0 0 340px", height: 220, background: C.bg, borderRadius: 12, border: `1px solid ${C.bd}`, overflow: "hidden", position: "relative" }}>
                  {/* Title bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderBottom: `1px solid ${C.bd}`, background: `${C.sf}` }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                    <span style={{ marginLeft: 8, fontSize: 10, color: C.tm, fontFamily: "DM Sans" }}>MuniScore — {screen.title}</span>
                  </div>
                  {/* Content mockup */}
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 32, textAlign: "center", marginBottom: 4 }}>{screen.icon}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {screen.features.map((f, j) => (
                        <div key={j} style={{ background: `${screen.color}11`, border: `1px solid ${screen.color}22`, borderRadius: 6, padding: "6px 8px", fontSize: 10, color: screen.color, fontFamily: "DM Sans", fontWeight: 500, textAlign: "center" }}>{f}</div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {[...Array(5)].map((_, j) => (
                        <div key={j} style={{ flex: 1, height: 3, borderRadius: 2, background: `${screen.color}${j < 3 ? "66" : "22"}` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12, background: `${screen.color}12`, border: `1px solid ${screen.color}33`, borderRadius: 99, padding: "5px 14px" }}>
                    <span style={{ fontSize: 16 }}>{screen.icon}</span>
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: screen.color }}>{screen.title}</span>
                  </div>
                  <p style={{ fontFamily: "DM Sans", fontSize: 15, lineHeight: 1.7, color: C.txs, margin: 0 }}>{screen.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="https://muniscore-brasil-ztvo.vercel.app/" target="_blank" rel="noopener" className="cta-btn" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color: C.bg,
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 800,
              fontFamily: "Outfit", textDecoration: "none", transition: "all .3s",
            }}>
              Experimente grátis por 7 dias <span style={{ fontSize: 18 }}>→</span>
            </a>
          </div>
        </div>
      </Section>

      {/* ── PAIN POINTS ── */}
      <Section>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", marginBottom: 16 }}>
              O custo de <span style={{ color: C.red }}>não saber</span>
            </h2>
            <p style={{ fontFamily: "DM Sans", color: C.tm, fontSize: 16, maxWidth: 550, margin: "0 auto" }}>
              Todo ano, empresas e investidores perdem dinheiro por falta de informação fiscal dos municípios.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {PAIN_POINTS.map((p, i) => (
              <div key={i} style={{
                background: `linear-gradient(135deg, ${C.sf}, ${C.sf2})`,
                border: `1px solid ${C.bd}`, borderRadius: 16, padding: 28,
                transition: "all .3s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.red}66`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#fff" }}>{p.title}</h3>
                <p style={{ fontFamily: "DM Sans", fontSize: 14, lineHeight: 1.6, color: C.tm }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SOLUTION BRIDGE ── */}
      <Section>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "60px 24px", textAlign: "center",
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.accent}08, ${C.blue}06)`,
            border: `1px solid ${C.accent}22`, borderRadius: 20, padding: "48px 40px",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💡</div>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>
              E se você pudesse avaliar qualquer município<br />
              <span style={{ color: C.accent }}>em menos de 5 segundos?</span>
            </h2>
            <p style={{ fontFamily: "DM Sans", color: C.txs, fontSize: 16, lineHeight: 1.7 }}>
              O MuniScore transforma milhares de dados fiscais públicos em um score simples, visual e acionável.
              Pare de adivinhar. Comece a decidir com dados.
            </p>
          </div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section id="features">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", marginBottom: 16 }}>
              Tudo que você precisa.<br /><span style={{ color: C.accent }}>Nada que não precisa.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 16, padding: 28,
                transition: "all .3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.accent}55`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${C.accent}12`, fontSize: 24, marginBottom: 16,
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 8, color: "#fff" }}>{f.title}</h3>
                <p style={{ fontFamily: "DM Sans", fontSize: 14, lineHeight: 1.6, color: C.tm }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SOCIAL PROOF ── */}
      <Section>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", marginBottom: 8 }}>
              Quem usa, <span style={{ color: C.accent }}>não volta atrás</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: `linear-gradient(135deg, ${C.sf}, ${C.sf2})`,
                border: `1px solid ${C.bd}`, borderRadius: 16, padding: 28,
                position: "relative",
              }}>
                <div style={{ fontSize: 40, color: `${C.accent}33`, fontFamily: "serif", lineHeight: 1, marginBottom: 8 }}>"</div>
                <p style={{ fontFamily: "DM Sans", fontSize: 15, lineHeight: 1.7, color: C.txs, marginBottom: 20 }}>{t.text}</p>
                <div>
                  <div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 14, color: "#fff" }}>{t.author}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: C.tm }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section id="pricing">
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "80px 24px",
        }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", marginBottom: 12 }}>
              Escolha seu plano
            </h2>
            <p style={{ fontFamily: "DM Sans", color: C.tm, fontSize: 16 }}>
              Teste grátis por 7 dias. Sem compromisso. Cancele quando quiser.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, maxWidth: 780, margin: "0 auto" }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: plan.popular ? `linear-gradient(135deg, ${C.sf}, ${C.accent}08)` : C.sf,
                border: `${plan.popular ? 2 : 1}px solid ${plan.popular ? C.accent + "66" : C.bd}`,
                borderRadius: 20, padding: 36, position: "relative",
                transition: "all .3s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color: C.bg,
                    padding: "5px 18px", borderRadius: 99, fontSize: 11, fontWeight: 800,
                    fontFamily: "Outfit", textTransform: "uppercase", letterSpacing: ".08em",
                  }}>Mais popular</div>
                )}
                <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 22, marginBottom: 4, color: "#fff" }}>{plan.name}</h3>
                <p style={{ fontFamily: "DM Sans", fontSize: 13, color: C.tm, marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: 48, color: plan.popular ? C.accent : "#fff" }}>
                    R${plan.price}
                  </span>
                  <span style={{ fontFamily: "DM Sans", fontSize: 14, color: C.tm }}>/mês</span>
                </div>
                <div style={{ marginBottom: 28 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <span style={{ color: C.accent, fontSize: 15, marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: "DM Sans", fontSize: 14, color: C.txs, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://muniscore-brasil-ztvo.vercel.app/?plan=${plan.id}`} target="_blank" rel="noopener"
                  className={plan.popular ? "cta-btn" : ""}
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 12, border: "none", cursor: "pointer",
                    background: plan.popular ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : "transparent",
                    color: plan.popular ? C.bg : C.txs,
                    border: plan.popular ? "none" : `1px solid ${C.bd}`,
                    fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
                    transition: "all .3s", textDecoration: "none", display: "block", textAlign: "center",
                  }}
                  onMouseEnter={e => {
                    if (!plan.popular) { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; }
                  }}
                  onMouseLeave={e => {
                    if (!plan.popular) { e.target.style.borderColor = C.bd; e.target.style.color = C.txs; }
                  }}
                >{plan.cta}</a>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", fontFamily: "DM Sans", fontSize: 13, color: C.tm, marginTop: 24 }}>
            Todos os planos incluem 7 dias de teste grátis · Sem fidelidade · Cancele quando quiser
          </p>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section id="faq">
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", marginBottom: 40, textAlign: "center" }}>
            Perguntas frequentes
          </h2>
          {FAQ.map((item, i) => (
            <div key={i} style={{
              borderBottom: `1px solid ${C.bd}`,
              paddingBottom: faqOpen === i ? 20 : 0, marginBottom: 4,
            }}>
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "18px 0", color: C.tx,
                }}
              >
                <span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 15, textAlign: "left" }}>{item.q}</span>
                <span style={{
                  color: C.accent, fontSize: 20, fontWeight: 300,
                  transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)",
                  transition: "transform .2s",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: faqOpen === i ? 200 : 0, overflow: "hidden",
                transition: "max-height .3s ease",
              }}>
                <p style={{ fontFamily: "DM Sans", fontSize: 14, lineHeight: 1.7, color: C.tm, paddingBottom: 4 }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <div style={{
        position: "relative", padding: "100px 24px", textAlign: "center",
        background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${C.accent}0a, transparent), ${C.bg}`,
      }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 900, fontSize: "clamp(28px, 4vw, 48px)",
          marginBottom: 16, lineHeight: 1.15,
        }}>
          Pare de correr riscos.<br />
          <span style={{ color: C.accent }}>Comece a decidir com dados.</span>
        </h2>
        <p style={{ fontFamily: "DM Sans", color: C.tm, fontSize: 16, maxWidth: 480, margin: "0 auto 32px" }}>
          7 dias grátis. Sem cartão de crédito. Sem compromisso.
        </p>
        <a href="https://muniscore-brasil-ztvo.vercel.app/" target="_blank" rel="noopener" className="cta-btn" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color: C.bg,
          padding: "18px 44px", borderRadius: 14, fontSize: 18, fontWeight: 800,
          fontFamily: "Outfit", textDecoration: "none", transition: "all .3s",
        }}>
          Começar agora <span style={{ fontSize: 22 }}>→</span>
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.bd}`, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
              <span style={{ color: C.accent }}>Muni</span><span style={{ color: "#fff" }}>Score</span>
            </div>
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: C.tm }}>
              Dados calculados com base nas APIs disponibilizadas pelo Tesouro Nacional.
            </div>
          </div>
          <div style={{ fontFamily: "DM Sans", fontSize: 12, color: C.tm }}>
            © {new Date().getFullYear()} MuniScore. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
