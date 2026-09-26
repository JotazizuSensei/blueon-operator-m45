# HANDOFF — HULK MULTI-MODEL ROUTER
**Data:** 2026-09-23  
**Estado:** REGRA CENTRAL / FONTE DE VERDADE  
**Destino:** HULK Command Center  
**Objetivo:** Introduzir gestão inteligente de vários modelos de IA sem alterar as responsabilidades dos motores BLUE.

---

## 1. PRINCÍPIO CENTRAL

O **HULK Command Center continua a ser o orquestrador central**.

O HULK:
- identifica o tipo de pedido;
- identifica o motor de negócio correto;
- escolhe o modelo de IA adequado;
- controla custo, contexto, ferramentas e risco;
- distribui tarefas;
- valida resultados quando necessário;
- gere fallback entre fornecedores/modelos.

O HULK **não deve transformar-se num motor de treino, marketing, design ou programação**.

### Arquitetura lógica

```text
UTILIZADOR
   ↓
HULK COMMAND CENTER
   ├── identifica DOMÍNIO
   ├── identifica RISCO
   ├── identifica COMPLEXIDADE
   ├── identifica FERRAMENTAS necessárias
   ├── estima CUSTO / CONTEXTO
   ↓
MOTOR DE NEGÓCIO
   ├── BLUECORE
   ├── BLUE GROW OS
   ├── BLUE CLASS ENGINE
   ├── BLUE SYMBIOTE
   ├── JFunkLab / Hi3D
   └── outros módulos
   ↓
MODEL ROUTER
   ├── MiMo FAST / FLASH
   ├── MiMo PRO
   ├── OpenAI / Codex
   └── Claude
   ↓
VALIDAÇÃO / EXECUÇÃO
   ↓
RESULTADO FINAL
```

---

# 2. NOVO COMPONENTE: HULK MODEL ROUTER

Criar dentro do HULK uma camada lógica chamada:

`HULK_MODEL_ROUTER`

Responsabilidade única:

> Escolher o modelo mais económico que consiga executar a tarefa com qualidade suficiente, escalando automaticamente para modelos superiores quando o risco, dificuldade ou necessidade de ferramentas o justificar.

Não escolher um modelo apenas porque é “o melhor”.

Escolher:

> **o modelo certo para a tarefa certa.**

---

# 3. ALIASES — NÃO FIXAR O SISTEMA A NOMES DE MODELOS

Nunca espalhar nomes concretos de modelos pelo código.

Usar aliases configuráveis:

```text
FAST_MODEL
VALUE_MODEL
REASONING_MODEL
CODING_AGENT
PREMIUM_MODEL
REVIEW_MODEL
```

Configuração inicial sugerida:

```text
FAST_MODEL      = MiMo V2.6 Flash
VALUE_MODEL     = MiMo V2.6 Pro
REASONING_MODEL = GPT-5.6 Sol
CODING_AGENT    = Codex
PREMIUM_MODEL   = Claude/GPT conforme disponibilidade
REVIEW_MODEL    = fornecedor diferente do modelo primário quando fizer sentido
```

Assim, quando surgir uma versão nova:

```text
MiMo V2.7
GPT-5.7
Claude Opus 6
etc.
```

é alterada apenas a configuração e não toda a arquitetura.

---

# 4. FILOSOFIA DE ROUTING

## NÍVEL 1 — BARATO / RÁPIDO / VOLUME

Usar `FAST_MODEL`.

Adequado para:
- classificação;
- tagging;
- transformação simples;
- extração estruturada;
- reformatação;
- resumos preliminares;
- limpeza de dados;
- geração de variações;
- tarefas repetitivas;
- pré-processamento;
- subagentes simples.

Objetivo:

> não gastar um modelo premium numa tarefa que um modelo rápido resolve corretamente.

---

## NÍVEL 2 — TRABALHO FORTE COM MELHOR CUSTO/BENEFÍCIO

Usar `VALUE_MODEL`.

Configuração inicial:
**MiMo V2.6 Pro**

Adequado para:
- programação;
- revisão de código;
- análise de muitos ficheiros;
- long context;
- criação de protótipos;
- refactoring;
- documentação técnica;
- investigação interna;
- análise estrutural;
- geração de testes;
- debugging inicial;
- agentes/subagentes;
- processamento em grande volume.

Deve ser o **workhorse económico** do ecossistema.

---

# 5. CODEX NÃO É APENAS UM MODELO

Quando a tarefa exige:

- abrir um repositório;
- editar vários ficheiros;
- correr comandos;
- instalar dependências;
- executar testes;
- compilar;
- verificar erros;
- iterar sobre código real;
- trabalhar dentro de um ambiente de desenvolvimento;

dar prioridade ao:

`CODING_AGENT`

Configuração inicial:
**Codex**

Mesmo que outro modelo tenha excelente capacidade de coding, o HULK deve distinguir:

```text
GERAR / ANALISAR CÓDIGO
```

de:

```text
OPERAR NUM REPOSITÓRIO REAL
```

Esta distinção é obrigatória.

---

# 6. ESCALAMENTO PARA MODELOS PREMIUM

Usar `REASONING_MODEL` ou `PREMIUM_MODEL` quando existir:

- ambiguidade elevada;
- arquitetura complexa;
- erro persistente depois de tentativa anterior;
- necessidade de raciocínio profundo;
- tarefa crítica;
- resultado contraditório;
- baixa confiança do modelo anterior;
- decisões com muitas dependências;
- necessidade de revisão independente.

O HULK pode executar:

```text
MiMo Pro → GPT/Claude REVIEW
```

em vez de:

```text
GPT/Claude → fazer tudo desde o início
```

Isto reduz custo.

---

# 7. REGRA DE OURO DE CUSTO

```text
CHEAPEST CAPABLE MODEL FIRST
```

Mas apenas quando não prejudicar:
- segurança;
- precisão;
- execução;
- qualidade final.

Nunca usar vários modelos em paralelo por defeito.

### Evitar

```text
MiMo + GPT + Claude para todas as tarefas
```

### Preferir

```text
MiMo
   ↓
resultado suficiente?
   ├── SIM → terminar
   └── NÃO → escalar
```

---

# 8. ROUTING POR COMPLEXIDADE

### COMPLEXIDADE BAIXA

```text
FAST_MODEL
```

Exemplos:
- formatar JSON;
- extrair campos;
- renomear;
- resumir;
- classificar.

---

### COMPLEXIDADE MÉDIA

```text
VALUE_MODEL
```

Exemplos:
- análise;
- programação normal;
- criação de conteúdos técnicos;
- documentação;
- transformação de vários ficheiros.

---

### COMPLEXIDADE ALTA

```text
VALUE_MODEL
→ REVIEW/REASONING_MODEL
```

ou diretamente:

```text
REASONING_MODEL
```

quando uma falha inicial for mais cara que o custo do modelo.

---

### AGENTIC CODING

```text
CODING_AGENT
```

quando houver acesso real a:
- terminal;
- repo;
- ficheiros;
- testes;
- build.

---

# 9. SISTEMA DE CONFIANÇA

Cada execução deve devolver internamente:

```json
{
  "confidence": 0.0,
  "needs_review": false,
  "risk_level": "low",
  "model_used": "",
  "reason_for_route": "",
  "estimated_cost_class": ""
}
```

Faixas:

```text
0.90–1.00 → aceitar normalmente
0.75–0.89 → aceitar se risco baixo
0.60–0.74 → revisão recomendada
< 0.60    → escalamento obrigatório
```

A confiança não deve basear-se apenas no que o próprio modelo afirma.

Considerar também:
- testes;
- compilação;
- validação estrutural;
- consistência entre ficheiros;
- regras do domínio;
- verificadores determinísticos.

---

# 10. VALIDADORES DETERMINÍSTICOS PRIMEIRO

Sempre que seja possível verificar algo sem outro LLM, fazê-lo.

Exemplos:

```text
Código
→ testes / lint / build

JSON
→ schema validation

HTML
→ parser / validator

Treino
→ regras BLUECORE

Ficheiros
→ existência / tamanho / checksum

Dados
→ tipos / ranges / constraints
```

Só usar outro modelo para revisão quando os testes objetivos não forem suficientes.

---

# 11. BLUECORE — REGRA ESPECIAL

O `BLUECORE` continua a ser o **motor de prescrição**.

Nenhum LLM deve inventar livremente um plano ignorando as regras BLUECORE.

Fluxo:

```text
pedido
↓
HULK
↓
BLUECORE
↓
regras de segurança / patologias / mobilidade / biomecânica / dose
↓
LLM escolhido pelo MODEL ROUTER
↓
formatação / explicação / adaptação
↓
validação BLUECORE
```

O modelo ajuda.

**BLUECORE manda.**

---

# 12. BLUE GROW OS

Fluxo:

```text
pedido de marketing/conteúdo
↓
HULK
↓
BLUE GROW OS
↓
se precisar de conhecimento técnico de treino
     ↓
   BLUECORE
↓
MODEL ROUTER
↓
geração
↓
BLUE GROW OS valida voz, branding e objetivo
```

Não pedir ao MiMo/GPT/Claude para substituir o BLUE GROW OS.

---

# 13. JFUNKLAB / DESENVOLVIMENTO

Estratégia sugerida:

```text
1. MiMo Pro
   ├── investigação
   ├── análise de código
   ├── geração de solução
   ├── documentação
   └── refactoring

2. Codex
   ├── alterar repositório real
   ├── executar
   ├── testar
   ├── compilar
   └── corrigir

3. GPT/Claude
   └── revisão difícil / arquitetura / erro persistente
```

Exemplo:

```text
MiMo:
"Analisa estes 50 ficheiros e propõe a alteração."

Codex:
"Implementa esta alteração no repo, testa e corrige."

GPT/Claude:
"Revê a arquitetura se continuar a existir um problema."
```

---

# 14. CONTEXTO: NÃO ENVIAR TUDO SEM NECESSIDADE

O facto de um modelo suportar contexto muito grande não significa que o HULK deva enviar tudo.

Prioridade:

```text
1. contexto relevante
2. memória resumida
3. ficheiros necessários
4. histórico mínimo suficiente
```

Evitar:
- repetir documentos;
- enviar handoffs inteiros quando bastam 3 secções;
- reenviar conteúdo já cacheado;
- carregar históricos gigantes sem necessidade.

---

# 15. CACHE

Sempre que o fornecedor/modelo suportar caching:

usar para:
- documentação permanente;
- especificações;
- system prompts;
- manuais;
- arquitetura BLUE;
- regras do BLUECORE;
- design system;
- grandes repositórios estáveis.

Objetivo:

> reduzir custo e latência sem perder contexto.

---

# 16. ORÇAMENTO

Criar configuração central:

```yaml
ai_budget:
  monthly_limit: configurable
  warning_70_percent: true
  warning_90_percent: true
  stop_noncritical_at_100_percent: true
```

Cada fornecedor deve ter:

```yaml
provider:
  enabled:
  monthly_budget:
  monthly_usage:
  remaining_quota:
```

---

# 17. MiMo STANDARD — SNAPSHOT INICIAL

Usar apenas como configuração, nunca hardcoded na lógica.

Snapshot de referência em 2026-09-23:

```text
Plano pretendido:
MiMo Token Plan Standard

Preço:
aprox. US$14–16/mês conforme modalidade/desconto

Quota indicada:
11.000.000.000 créditos/mês
```

Os preços, créditos e modelos devem ficar num ficheiro/configuração atualizável.

Exemplo:

```yaml
mimo:
  plan: standard
  monthly_credits: 11000000000
  model:
    flash:
      enabled: true
    pro:
      enabled: true
```

---

# 18. TELEMETRIA

Registar por tarefa:

```text
task_id
data/hora
motor de negócio
modelo escolhido
tokens input
tokens output
cache hits
custo estimado
tempo
resultado
erros
número de tentativas
houve escalamento?
modelo de revisão
resultado aprovado?
```

Isto permite descobrir empiricamente:

> Qual modelo dá melhor resultado por euro para cada tipo de trabalho?

---

# 19. SCORE INTERNO DE MODELOS

Não criar um ranking universal.

Criar histórico por categoria:

```text
CODING
ANÁLISE
CONTEÚDO
LONG CONTEXT
REASONING
TOOL USE
DOCUMENTOS
DEBUGGING
```

Guardar:

```text
taxa de sucesso
número médio de tentativas
custo médio
latência
necessidade de revisão
```

O HULK passa gradualmente a aprender qual motor funciona melhor em cada tarefa.

---

# 20. FAILOVER

Se um fornecedor:

- estiver indisponível;
- atingir quota;
- der erro;
- ficar demasiado lento;
- rejeitar contexto;
- falhar duas vezes na mesma tarefa;

o HULK deve tentar automaticamente o próximo modelo compatível.

Exemplo:

```text
MiMo Pro
↓ falha
GPT
↓ falha
Claude
```

Para coding agentic:

```text
Codex
↓ indisponível
outro coding agent configurado
```

---

# 21. NÃO LOOPAR INFINITAMENTE

Máximo recomendado:

```text
2 tentativas no mesmo modelo
+
1 escalamento
+
1 revisão
```

Depois disso:

```text
STOP
→ apresentar erro real
→ preservar logs
→ pedir decisão humana apenas se necessário
```

Nunca esconder ciclos de falha.

---

# 22. SEGURANÇA E DADOS

Nunca enviar automaticamente para fornecedores externos:

- passwords;
- API keys;
- tokens;
- dados bancários;
- dados pessoais sensíveis;
- informação de clientes que não seja necessária.

Secrets devem permanecer em:
- variables de ambiente;
- vault;
- secret manager.

Nunca dentro de prompts, logs ou handoffs.

---

# 23. ÁREAS DE RISCO ELEVADO

Para:

- saúde;
- treino com patologias;
- finanças;
- decisões legais;
- segurança física;
- execução que possa apagar/modificar dados importantes;

exigir:

```text
domínio/regras específicas
+
validação determinística sempre que possível
+
human-in-the-loop quando necessário
```

Nenhum modelo deve executar autonomamente uma ação irreversível de risco elevado apenas porque tem alta confiança.

---

# 24. MODO CRÍTICO

Quando:

```text
risk_level = high
```

usar:

```text
modelo primário
+
validador independente
```

Preferencialmente de fornecedor diferente.

Exemplo:

```text
MiMo Pro
→ GPT review
```

ou

```text
GPT
→ Claude review
```

Mas só quando houver benefício real.

---

# 25. ROUTER — PSEUDOCÓDIGO

```python
def route(task):

    domain = detect_domain(task)
    risk = assess_risk(task)
    tools = detect_required_tools(task)
    complexity = estimate_complexity(task)

    engine = select_business_engine(domain)

    if tools.requires_real_repo_execution:
        model = CODING_AGENT

    elif complexity == "low" and risk == "low":
        model = FAST_MODEL

    elif complexity in ["medium", "high"] and risk != "critical":
        model = VALUE_MODEL

    else:
        model = REASONING_MODEL

    result = execute(engine, model, task)

    result = deterministic_validation(result)

    if result.failed:
        result = escalate(result)

    if risk == "high" or result.confidence < threshold:
        result = independent_review(result)

    return finalise(result)
```

---

# 26. PRINCÍPIO ECONÓMICO DO ECOSSISTEMA

O objetivo não é:

> usar sempre o modelo mais inteligente.

O objetivo é:

> **obter o resultado correto com o menor custo total de computação e o menor número de tentativas.**

Custo real inclui:

```text
preço do modelo
+
tempo
+
erros
+
retries
+
revisões
+
intervenção humana
```

Um modelo barato que falha cinco vezes pode ser mais caro que um modelo premium que resolve à primeira.

---

# 27. TESTE A/B REAL

Antes de alterar definitivamente o routing:

usar tarefas reais do ecossistema.

Criar benchmark interno com pelo menos:

```text
5 tarefas de coding
5 tarefas de análise
5 tarefas long-context
5 tarefas de documentação
5 tarefas de conteúdo
```

Executar, quando economicamente razoável:

```text
MiMo
GPT/Codex
Claude
```

Medir:

```text
qualidade final
sucesso à primeira
tempo
custo
erros
revisões necessárias
```

Não escolher fornecedor por benchmark de marketing.

Escolher por:

> **benchmark BLUE real.**

---

# 28. POLÍTICA DE OTIMIZAÇÃO CONTÍNUA

A cada 30–90 dias:

- rever modelos disponíveis;
- rever preços;
- rever qualidade;
- rever quotas;
- atualizar aliases;
- manter histórico comparável.

O HULK deve poder trocar o backend sem alterar os motores BLUE.

---

# 29. RESULTADO PRETENDIDO

Arquitetura final:

```text
                    HULK
                      │
            ┌─────────┴─────────┐
            │                   │
       DOMAIN ROUTER       MODEL ROUTER
            │                   │
   ┌────────┼────────┐    ┌─────┼─────────┐
BLUECORE  GROW OS  JFUNK  FAST VALUE CODEX PREMIUM
   │        │        │
   └────────┴────────┘
            │
       VALIDADORES
            │
        RESULTADO
```

O HULK controla.

Os motores BLUE definem a lógica do negócio.

Os LLMs são trabalhadores substituíveis.

---

# 30. REGRA FINAL

> **Nunca construir o ecossistema BLUE dependente de um único fornecedor de IA.**

OpenAI, Xiaomi, Anthropic ou qualquer outro fornecedor são **motores substituíveis**.

A inteligência proprietária do ecossistema deve permanecer em:

- HULK;
- BLUECORE;
- BLUE GROW OS;
- BLUE SYMBIOTE;
- BLUE Class Engine;
- JFunkLab;
- regras;
- dados;
- workflows;
- validações;
- memória própria.

Os modelos entram e saem.

**A arquitetura permanece.**