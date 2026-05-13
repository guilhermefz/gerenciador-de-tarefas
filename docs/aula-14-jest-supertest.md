# Aula 14: Teste Unitário com Jest e Teste de API com Supertest

## Onde estamos

Nas aulas anteriores você viu o que é teste, por que ele importa e como organizá-lo. Na aula 12 a pirâmide de testes mostrou três camadas: a base (testes unitários), o meio (integração) e o topo (E2E). Você também viu exemplos de código Jest e Supertest nos slides.

Esta aula é a passagem da teoria para a prática. Você vai escrever os testes que já apareceram nos slides, aplicados a uma aplicação real que está rodando na sua máquina.

Ao final desta aula, você terá:

- Configurado e executado testes com Jest em um projeto TypeScript
- Escrito testes unitários para funções puras usando o padrão Arrange-Act-Assert
- Escrito testes de API com Supertest para validar *endpoints* REST
- Lido e interpretado a saída do Jest quando um teste passa e quando ele falha

---

## Parte 0: Conhecendo e configurando o projeto

Vamos trabalhar com o **Gerenciador de Tarefas**, uma aplicação com *backend* em Express/TypeScript e *frontend* em React.

> **Terminal no Windows:** use o **PowerShell** (pelo Windows Terminal ou pelo menu Iniciar). Evite o Prompt de Comando (cmd.exe): alguns comandos abaixo não funcionam nele.

### 0.1 Clone o repositório

```bash
git clone https://github.com/unisenaiketly/gerenciador-de-tarefas
cd gerenciador-de-tarefas
```

### 0.2 Instale as dependências

```bash
npm install

cd server
npm install
cd ..

cd client
npm install
cd ..
```

### 0.3 Configure o ambiente

```bash
cp .env.example .env

cd server
cp .env.example .env
cd ..
```

### 0.4 Inicialize o banco de dados

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 0.5 Suba a aplicação

```bash
npm run dev
```

O servidor inicia na porta 5000 e o cliente na porta 5173.

### 0.6 Explore a aplicação

Abra `http://localhost:5173` e faça o seguinte:

1. Crie uma conta
2. Faça login
3. Crie duas ou três tarefas com prioridades diferentes
4. Marque uma como concluída
5. Edite uma tarefa
6. Delete uma tarefa

O que você fez foi executar **testes manuais**: navegou pela aplicação e verificou se ela funciona. O objetivo desta aula é automatizar verificações como essas.

### 0.7 Entenda a estrutura

Pare o servidor (`Ctrl+C`) e observe:

```
gerenciador-de-tarefas/
├── server/
│   └── src/
│       ├── controllers/     ← Recebem as requisições HTTP
│       ├── services/        ← Lógica de negócio
│       ├── routes/          ← Definição das rotas
│       ├── middlewares/     ← Autenticação, tratamento de erros
│       ├── errors/          ← Classes de erro customizadas
│       ├── utils/           ← Funções utilitárias (vamos testar estas!)
│       └── tests/           ← Onde vamos escrever nossos testes
├── client/                  ← Frontend (aula 15)
├── prisma/                  ← Schema do banco de dados
└── package.json
```

Abra e leia antes de continuar. Em cada arquivo, observe o que está indicado:

- `prisma/schema.prisma`: quais campos o modelo `Tarefa` tem e quais são opcionais
- `server/src/routes/tarefa.routes.ts`: quais rotas existem e quais exigem autenticação
- `server/src/services/tarefa.service.ts`: como a lógica de negócio usa as funções de `utils/`
- `server/src/utils/tarefa.utils.ts`: leia cada função, sua entrada, lógica e o que retorna

> **Checkpoint:** O projeto tem um CRUD de tarefas com autenticação JWT. A lógica de negócio fica nos `services/`, as funções puras em `utils/`. Esta aula cobre os dois primeiros níveis da pirâmide: testes unitários (`utils/`) e testes de integração (`routes/`).

---

## Parte 1: Testes Unitários com Jest

### O que é um teste unitário?

Na aula 12 você viu: um teste unitário testa a **menor unidade isolada** de código, sem banco de dados, sem rede, sem efeitos colaterais. Roda em milissegundos e é escrito pelo próprio desenvolvedor.

### 1.1 Verifique que o Jest está configurado

```bash
cd server
npx jest --version
```

Deve aparecer algo como `29.7.0`. Se der erro, rode `npm install`.

Abra `server/jest.config.ts`:

```typescript
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.ts'],
    setupFiles: ['<rootDir>/jest.setup.ts'],
};
```

A configuração instrui o Jest a usar TypeScript via `ts-jest`, buscar testes dentro de `src/` e carregar as variáveis de ambiente antes de rodar.

### 1.2 As funções que vamos testar

Abra `server/src/utils/tarefa.utils.ts` e `server/src/utils/autenticacao.utils.ts`. São seis funções no total, e todas estão sendo chamadas em algum ponto da aplicação:

| Função | O que faz | Onde é usada |
|---|---|---|
| `formatarPrioridade(prioridade)` | Converte "low"/"medium"/"high" para "Baixa"/"Média"/"Alta" | `GET /api/tarefas/estatisticas`: formata os rótulos de prioridade na resposta |
| `estaAtrasada(tarefa, agora?)` | Verifica se uma tarefa está vencida | `GET /api/tarefas/estatisticas`: conta tarefas em atraso |
| `diasParaVencimento(dataVencimento, agora?)` | Calcula quantos dias faltam para o vencimento | `GET /api/tarefas/estatisticas`: conta tarefas vencendo em 7 dias |
| `validarEmail(email)` | Verifica se um e-mail tem formato válido | `POST /api/autenticacao/registrar`: rejeita e-mails inválidos com status 400 |
| `calcularEstatisticas(tarefas)` | Gera resumo com total, concluídas e contagem por prioridade | `GET /api/tarefas/estatisticas`: base do cálculo de estatísticas |
| `validarForcaSenha(senha)` | Verifica comprimento, letras e números | `POST /api/autenticacao/registrar`: rejeita senhas fracas com status 400 |

Essas funções são **puras**: recebem dados, processam e retornam resultado, sem banco de dados e sem efeitos colaterais. São candidatas diretas para teste unitário.

Antes de continuar, abra os arquivos de serviço e veja as chamadas reais: `server/src/services/autenticacao.service.ts` (método `registrarUsuario`) e `server/src/services/tarefa.service.ts` (método `buscarEstatisticas`). Identificar onde uma função é usada é parte da análise que um testador precisa fazer antes de escrever os casos de teste.

### 1.3 Seu primeiro teste (guiado)

Crie o arquivo `server/src/tests/services/tarefa.utils.test.ts`:

```typescript
import {
  formatarPrioridade,
  estaAtrasada,
  diasParaVencimento,
  validarEmail,
  calcularEstatisticas,
} from '../../utils/tarefa.utils';

describe('formatarPrioridade', () => {
  it('deve retornar "Baixa" para prioridade "low"', () => {
    // Arrange (preparar)
    const entrada = 'low';

    // Act (agir)
    const resultado = formatarPrioridade(entrada);

    // Assert (verificar)
    expect(resultado).toBe('Baixa');
  });

  it('deve retornar "Média" para prioridade "medium"', () => {
    const resultado = formatarPrioridade('medium');
    expect(resultado).toBe('Média');
  });

  it('deve retornar "Alta" para prioridade "high"', () => {
    const resultado = formatarPrioridade('high');
    expect(resultado).toBe('Alta');
  });

  it('deve retornar "Desconhecida" para valor não mapeado', () => {
    const resultado = formatarPrioridade('urgente');
    expect(resultado).toBe('Desconhecida');
  });

  it('deve retornar "Desconhecida" para string vazia', () => {
    const resultado = formatarPrioridade('');
    expect(resultado).toBe('Desconhecida');
  });
});
```

Execute:

```bash
cd server
npx jest tarefa.utils.test.ts
```

Saída esperada:

```
 PASS  src/tests/services/tarefa.utils.test.ts
  formatarPrioridade
    ✓ deve retornar "Baixa" para prioridade "low"
    ✓ deve retornar "Média" para prioridade "medium"
    ✓ deve retornar "Alta" para prioridade "high"
    ✓ deve retornar "Desconhecida" para valor não mapeado
    ✓ deve retornar "Desconhecida" para string vazia

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

> **Checkpoint:** Os 5 testes devem aparecer em verde.

O padrão usado:
- `describe('nome', () => {...})` agrupa testes relacionados
- `it('deve fazer algo', () => {...})` define um caso de teste
- `expect(valor).toBe(esperado)` é a asserção
- **Arrange-Act-Assert**: prepare os dados, execute a função, verifique o resultado

### 1.4 O que acontece quando um teste falha?

Antes de continuar, é importante saber ler um teste vermelho. Existem dois cenários distintos.

**Cenário A: o teste está errado**

Substitua temporariamente uma das asserções por um valor incorreto:

```typescript
it('deve retornar "Alta" para prioridade "high"', () => {
  const resultado = formatarPrioridade('high');
  expect(resultado).toBe('Altíssima'); // valor errado de propósito
});
```

Execute e observe a saída:

```
 FAIL  src/tests/services/tarefa.utils.test.ts
  formatarPrioridade
    ✕ deve retornar "Alta" para prioridade "high"

  ● formatarPrioridade › deve retornar "Alta" para prioridade "high"

    expect(received).toBe(expected)

    Expected: "Altíssima"
    Received: "Alta"
```

O Jest mostra exatamente o que era esperado e o que chegou. Neste caso, o problema é no teste (a expectativa está errada), não no código.

**Cenário B: o código está com defeito**

Corrija o teste e introduza um defeito na função. Abra `tarefa.utils.ts` e mude temporariamente:

```typescript
// antes
low: 'Baixa',
// depois (com defeito)
low: 'Baixissima',
```

Execute novamente e leia a saída. Desta vez o teste está certo e o código está errado.

Corrija o arquivo `tarefa.utils.ts` antes de continuar.

> **Checkpoint:** Você viu dois tipos distintos de falha. Na prática, quando um teste fica vermelho, a primeira pergunta é sempre: o problema é no teste ou no código?

### 1.5 Segundo teste: complete as lacunas

Adicione o bloco abaixo **no mesmo arquivo**, depois do `describe` de `formatarPrioridade`.

**Atenção:** neste exercício, a maioria dos `___` representa um **valor** (como `true`, `null` ou uma data). Mas em um dos casos representa o **nome de uma função**. Observe o contexto da linha antes de preencher.

```typescript
describe('estaAtrasada', () => {
  // Data fixa para os testes: 15 de junho de 2025
  const hoje = new Date('2025-06-15');

  it('deve retornar true para tarefa não concluída com data passada', () => {
    const tarefa = {
      dataVencimento: new Date('2025-06-10'), // 5 dias atrás
      concluida: false,
    };

    const resultado = estaAtrasada(tarefa, hoje);

    expect(resultado).toBe(true);
  });

  it('deve retornar false para tarefa concluída mesmo com data passada', () => {
    const tarefa = {
      dataVencimento: new Date('2025-06-10'),
      concluida: ___, // ← COMPLETE: qual valor faz a tarefa ser concluída?
    };

    const resultado = estaAtrasada(tarefa, hoje);

    expect(resultado).toBe(___); // ← COMPLETE: o que deve retornar?
  });

  it('deve retornar false para tarefa sem data de vencimento', () => {
    const tarefa = {
      dataVencimento: ___, // ← COMPLETE: como representar "sem data"?
      concluida: false,
    };

    const resultado = estaAtrasada(tarefa, hoje);

    expect(resultado).toBe(false);
  });

  it('deve retornar false para tarefa com data futura', () => {
    const tarefa = {
      dataVencimento: ___, // ← COMPLETE: crie uma data posterior a 15/06/2025
      concluida: false,
    };

    const resultado = ___(tarefa, hoje); // ← COMPLETE: qual função chamar?

    expect(resultado).toBe(___); // ← COMPLETE
  });
});
```

Complete os trechos marcados com `___`, salve e execute:

```bash
npx jest tarefa.utils.test.ts
```

> **Checkpoint:** Devem passar 9 testes (5 anteriores + 4 novos). Se algum falhou, leia a implementação de `estaAtrasada` em `tarefa.utils.ts` e ajuste as expectativas.

### 1.6 Terceiro teste: `diasParaVencimento`

Adicione um novo `describe('diasParaVencimento', () => {...})` no mesmo arquivo com testes para:

1. Tarefa com vencimento daqui a 5 dias deve retornar 5
2. Tarefa com vencimento há 3 dias deve retornar um valor negativo
3. Tarefa sem data de vencimento (`null`) deve retornar `null`
4. Tarefa com vencimento hoje deve retornar 0

**Pontos de atenção:**
- Use uma data `agora` fixa, como já foi feito no exemplo de `estaAtrasada`. Se você usar `new Date()` (data real do sistema), o resultado do teste vai mudar dependendo de quando ele for executado. Com uma data fixa, o teste sempre produz o mesmo resultado, independente do dia em que rodar
- Quando o resultado for um número, use `expect(resultado).toBe(5)`. Quando a função retornar `null` (tarefa sem data de vencimento), use `expect(resultado).toBeNull()` em vez de `expect(resultado).toBe(null)`. As duas formas funcionam, mas `toBeNull()` deixa a intenção mais clara na leitura
- A função usa `Math.ceil` internamente, o que arredonda frações de dia para cima. Por exemplo: se faltam 4,3 dias, `Math.ceil(4.3)` retorna `5`. Leve isso em conta ao calcular o valor esperado em cada cenário

```bash
npx jest tarefa.utils.test.ts
```

> **Checkpoint:** Se os resultados forem inesperados, releia a implementação da função e ajuste as expectativas dos testes.

### 1.7 Cobertura de código

Com os testes escritos, você pode verificar quanto do código está sendo exercitado:

```bash
npm run coverage
```

O relatório aparece no terminal e também em arquivo HTML. Para abri-lo: no explorador de arquivos, navegue até a pasta `server/coverage/lcov-report/` dentro do projeto e abra `index.html` no navegador. Lá você verá linha por linha quais caminhos foram ou não foram testados.

> **Sobre cobertura:** cobertura de código mede o que foi **executado**, não o que foi **verificado corretamente**. Um teste que chama a função mas não faz nenhuma asserção útil pode ter 100% de cobertura e ainda assim não detectar defeitos. Cobertura alta é um bom sinal, mas não garante que os testes são bons.

---

## `toBe` vs `toEqual`

Antes de passar para os testes de API, um ponto importante. Até aqui você usou `toBe` para comparar strings e booleanos. Quando o resultado for um **objeto** ou **array**, `toBe` falha mesmo que os valores sejam iguais:

```typescript
// Isso FALHA, mesmo que os objetos pareçam iguais
expect({ total: 3 }).toBe({ total: 3 });

// Isso PASSA
expect({ total: 3 }).toEqual({ total: 3 });
```

A razão: `toBe` usa `===`, que compara referências. Dois objetos distintos na memória nunca são `===`, mesmo com os mesmos valores. `toEqual` faz comparação profunda de valores.

**Regra prática:**
- Use `toBe` para primitivos: strings, números, booleanos, `null`, `undefined`
- Use `toEqual` para objetos e arrays

---

## Parte 2: Testes de API com Supertest

### O que muda em relação ao teste unitário?

No teste unitário, testamos funções isoladas. No teste de API, fazemos **requisições HTTP reais** para os *endpoints* do servidor e verificamos as respostas. É um teste de integração que envolve roteamento, *middleware*, lógica de negócio e banco de dados, as "peças de LEGO encaixadas" da aula 12.

Por isso os testes de API usam `async/await`: uma requisição HTTP é uma operação assíncrona: o código envia a requisição e precisa **esperar** a resposta antes de verificá-la. Sem `await`, o teste terminaria antes de a resposta chegar e as asserções nunca seriam executadas. Os testes da Parte 1 não precisam disso porque chamar `formatarPrioridade('low')` é instantâneo e síncrono.

**Status codes HTTP:** ao longo desta parte você vai verificar códigos como `200`, `201`, `204` e `404`. A biblioteca `http-status-codes` (já importada nos exemplos guiados) fornece nomes legíveis para esses números: `StatusCodes.OK` é `200`, `StatusCodes.CREATED` é `201`, `StatusCodes.NOT_FOUND` é `404`. Os dois formatos são equivalentes, use o que preferir.

### Sobre *mocks*

Na aula 12 você viu o conceito: quando uma função depende de algo externo (banco, rede, serviço), você substitui essa dependência por uma **versão controlada** chamada *mock*. O *mock* responde com dados prontos, sem acessar o recurso real.

Nos testes de API desta aula, todas as rotas de tarefas exigem autenticação JWT. Em vez de gerar tokens reais em cada teste, vamos mockar o *middleware* de autenticação, substituindo-o por uma versão que simplesmente define o `usuarioId` e deixa a requisição passar. Isso isola o teste do sistema de autenticação.

### 2.1 Entenda a infraestrutura de teste

O projeto já tem tudo configurado:

- **Banco separado:** `.env.test` aponta para `dev-test.db`, sem interferência nos dados de desenvolvimento
- **Setup do banco:** `server/src/tests/setup.test.db.ts` limpa o banco e cria um usuário de teste antes de cada *suite*
- **Jest setup:** `server/jest.setup.ts` carrega as variáveis de ambiente de teste

Abra e leia `server/src/tests/setup.test.db.ts`. O arquivo:
1. Limpa todas as tarefas e usuários do banco de teste
2. Cria um usuário com senha hasheada
3. Exporta `usuarioTeste` com `id`, `email` e `senha`; você vai precisar desses três nos testes de autenticação da Parte 3

### 2.2 As rotas que vamos testar

Abra `server/src/routes/tarefa.routes.ts`. As rotas disponíveis:

| Método | Rota | O que faz |
|---|---|---|
| POST | `/api/tarefas` | Cria uma tarefa |
| GET | `/api/tarefas` | Lista tarefas do usuário |
| GET | `/api/tarefas/estatisticas` | Estatísticas das tarefas do usuário |
| GET | `/api/tarefas/:id` | Busca uma tarefa por ID |
| PUT | `/api/tarefas/:id` | Atualiza uma tarefa |
| DELETE | `/api/tarefas/:id` | Remove uma tarefa |

### 2.3 Primeiro teste de API (guiado)

Prepare o banco de dados de teste:

```bash
cd server
npm run migrate:test
```

Antes de criar o arquivo, três pontos que podem causar dúvida:

- **Posição do `jest.mock`:** precisa ficar antes dos imports. O Jest garante que ele seja executado antes de qualquer módulo ser carregado, mas para que o TypeScript e o linter não reclamem da ordem, a convenção é declará-lo no topo. Siga esse padrão em todos os arquivos de teste que usarem *mocks*.
- **Operador `??`:** `usuarioTeste.id ?? 1` retorna `usuarioTeste.id` se ele existir, ou `1` como alternativa. É uma precaução para o caso de `configurarBancoDeTeste` ainda não ter rodado.
- **`beforeAll` e `afterAll`:** `beforeAll` roda uma vez antes de todos os testes do arquivo, para preparar o banco. `afterAll` roda ao final, para fechar a conexão e liberar recursos.

Crie `server/src/tests/routes/tarefa.routes.test.ts`:

```typescript
jest.mock('../../middlewares/autenticacao.middleware', () => ({
    autenticar: (req: any, res: any, next: any) => {
        req.usuarioId = usuarioTeste.id ?? 1;
        next();
    },
}));

import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app';
import { prisma } from '../../utils/prisma';
import { configurarBancoDeTeste, desconectarBancoDeTeste, usuarioTeste } from '../setup.test.db';

beforeAll(async () => {
    await configurarBancoDeTeste();
});

afterAll(async () => {
    await desconectarBancoDeTeste();
});

describe('POST /api/tarefas', () => {
    it('deve criar uma tarefa com dados válidos e retornar 201', async () => {
        // Arrange
        const novaTarefa = {
            titulo: 'Estudar Jest',
            descricao: 'Aprender a escrever testes unitários',
            prioridade: 'high',
        };

        // Act
        const response = await request(app)
            .post('/api/tarefas')
            .send(novaTarefa);

        // Assert
        // 1. Status code correto
        expect(response.status).toBe(StatusCodes.CREATED);

        // 2. Corpo da resposta contém os dados enviados
        expect(response.body.titulo).toBe('Estudar Jest');
        expect(response.body.descricao).toBe('Aprender a escrever testes unitários');
        expect(response.body.prioridade).toBe('high');

        // 3. Campos gerados automaticamente estão presentes
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('criadaEm');
        expect(response.body.usuarioId).toBe(usuarioTeste.id);

        // 4. Tarefa foi salva no banco
        const tarefaNoBanco = await prisma.tarefa.findFirst({
            where: { titulo: 'Estudar Jest' },
        });
        expect(tarefaNoBanco).not.toBeNull();
    });
});
```

Execute:

```bash
npx jest tarefa.routes.test.ts
```

> **Checkpoint:** O teste deve passar. O Supertest fez uma requisição POST real para `/api/tarefas`, o Express processou, o Prisma salvou no banco de teste, e verificamos tanto a resposta HTTP quanto o banco de dados.

Para comparar os dois níveis de teste:
- **Teste unitário** (Parte 1): `formatarPrioridade('low')` → verificamos o retorno direto
- **Teste de integração** (Parte 2): `request(app).post('/api/tarefas').send({...})` → verificamos status, corpo e banco

### 2.4 Segundo teste: complete as lacunas

Adicione ao mesmo arquivo:

```typescript
describe('GET /api/tarefas', () => {
    it('deve listar as tarefas do usuário', async () => {
        // Arrange
        await request(app)
            .post('/api/tarefas')
            .send({ titulo: 'Tarefa para listar', prioridade: 'low' });

        // Act
        const response = await request(app)
            .get(___); // ← COMPLETE: qual a rota para listar tarefas?

        // Assert
        expect(response.status).toBe(___); // ← COMPLETE: qual status para sucesso?
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(___); // ← COMPLETE: mínimo esperado
    });
});

describe('GET /api/tarefas/:id', () => {
    it('deve retornar 404 para tarefa inexistente', async () => {
        const response = await request(app)
            .get('/api/tarefas/99999');

        expect(response.status).toBe(___); // ← COMPLETE: qual status para "não encontrado"?
        expect(response.body).toHaveProperty(___); // ← COMPLETE: qual campo da resposta de erro?
    });
});
```

**Pontos de apoio:**
- Confirme as rotas em `server/src/routes/tarefa.routes.ts`
- Status de sucesso para GET é `200` (ou `StatusCodes.OK`)
- Veja em `server/src/controllers/tarefa.controller.ts` o que o *endpoint* retorna em caso de erro

```bash
npx jest tarefa.routes.test.ts
```

> **Checkpoint:** Os 3 testes de API devem passar.

### 2.5 Terceiro teste de API: estatísticas (guiado)

O *endpoint* `GET /api/tarefas/estatisticas` usa as mesmas funções que você testou na Parte 1, mas agora como parte de um fluxo HTTP completo. Adicione ao mesmo arquivo:

```typescript
describe('GET /api/tarefas/estatisticas', () => {
    it('deve retornar estatísticas corretas após criar tarefas', async () => {
        // Arrange: cria duas tarefas com prioridades diferentes
        await request(app).post('/api/tarefas').send({ titulo: 'Tarefa A', prioridade: 'high' });
        await request(app).post('/api/tarefas').send({ titulo: 'Tarefa B', prioridade: 'low' });

        // Act
        const response = await request(app).get('/api/tarefas/estatisticas');

        // Assert
        expect(response.status).toBe(StatusCodes.OK);

        // Verifica que os campos existem
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('concluidas');
        expect(response.body).toHaveProperty('pendentes');
        expect(response.body).toHaveProperty('atrasadas');
        expect(response.body).toHaveProperty('porPrioridade');
        expect(response.body).toHaveProperty('vencendoEm7Dias');

        // Verifica os valores esperados.
        // Usamos toBeGreaterThanOrEqual em vez de toBe(2) porque os testes
        // anteriores neste arquivo já criaram tarefas no mesmo banco.
        // O banco é limpo uma vez no beforeAll, não antes de cada teste.
        expect(response.body.total).toBeGreaterThanOrEqual(2);
        expect(response.body.pendentes).toBeGreaterThanOrEqual(2);

        // porPrioridade usa rótulos em PT-BR (veja formatarPrioridade)
        expect(response.body.porPrioridade).toHaveProperty('Alta');
        expect(response.body.porPrioridade).toHaveProperty('Baixa');
    });
});
```

Execute e verifique que o teste passa. Observe a conexão: o campo `porPrioridade` usa exatamente os valores que `formatarPrioridade` retorna, os mesmos que você testou na Parte 1.

> **Checkpoint:** O teste de integração confirma que as funções unitárias estão integradas corretamente no *endpoint*.

### 2.6 Escreva seus próprios testes de API

No mesmo arquivo, escreva testes para:

**Cenário 1: PUT /api/tarefas/:id**
1. Crie uma tarefa via POST
2. Atualize o título via PUT usando o ID retornado
3. Verifique que o status é 200 e o título foi alterado

**Cenário 2: DELETE /api/tarefas/:id**
1. Crie uma tarefa via POST
2. Delete via DELETE usando o ID retornado
3. Verifique que o status é 204 (No Content)
4. Tente buscar a tarefa deletada via GET (ela não deve mais existir)

**Cenário 3: POST /api/tarefas com título inválido**
1. Tente criar uma tarefa com título começando em número (ex: `"1 Tarefa inválida"`)
2. Verifique o status code retornado (leia `server/src/controllers/tarefa.controller.ts` e `server/src/errors/task/NomeTarefaInvalidoError.ts`)

**Referência:**
- Para capturar o ID criado: `const { body } = await request(app).post(...).send({...}); const id = body.id;`
- Para DELETE: `` request(app).delete(`/api/tarefas/${id}`) ``
- Para PUT: `` request(app).put(`/api/tarefas/${id}`).send({ titulo: 'Novo título' }) ``

---

## Parte 3: Atividades

Se você terminou as Partes 1 e 2 antes do fim da aula, continue aqui; caso contrário, ficam para estudo extraclasse. Não há passo a passo, use o que foi praticado como referência.

### Atividade 1: Testes unitários para `validarEmail`

No arquivo `tarefa.utils.test.ts`, adicione `describe('validarEmail', () => {...})` com testes para:

- E-mail válido comum (ex: `usuario@exemplo.com`)
- E-mail sem `@`
- E-mail sem domínio depois do `@`
- E-mail sem ponto no domínio
- E-mail com espaços
- String vazia

### Atividade 2: Testes unitários para `calcularEstatisticas`

Adicione testes para `calcularEstatisticas` cobrindo:

- Lista vazia (o que retorna?)
- Lista com tarefas mistas (concluídas e pendentes)
- Contagem correta por prioridade em `porPrioridade`
- Tarefas sem prioridade definida (como aparecem nas estatísticas?)

**Atenção ao matcher:** `calcularEstatisticas` retorna um objeto. Para comparar objetos, use `toEqual` em vez de `toBe`, como visto antes de iniciar a Parte 2.

**Lembrete:** a função recebe uma lista de objetos com os campos `concluida` e `prioridade`. Exemplo:

```typescript
const tarefas = [
  { concluida: true, prioridade: 'high' },
  { concluida: false, prioridade: 'low' },
];
```

### Atividade 3: Testes unitários para `validarForcaSenha`

Abra `server/src/utils/autenticacao.utils.ts`, leia a função `validarForcaSenha` e crie `server/src/tests/services/autenticacao.utils.test.ts` com testes para:

- Senha válida (6+ caracteres, com letra e número)
- Senha curta demais (menos de 6 caracteres)
- Senha só com letras (sem número)
- Senha só com números (sem letra)
- Verificar que o campo `razao` contém a mensagem correta em cada caso de falha

### Atividade 4: Testes de API para autenticação

Crie `server/src/tests/routes/autenticacao.routes.test.ts` com testes para:

- `POST /api/autenticacao/registrar` com dados válidos (deve retornar 201 e um token)
- `POST /api/autenticacao/registrar` com e-mail já existente (deve retornar erro)
- `POST /api/autenticacao/registrar` com e-mail inválido (ex: `"nao-e-um-email"`): qual status e mensagem você espera?
- `POST /api/autenticacao/registrar` com senha fraca (ex: `"abc"`): verifique o campo `message` da resposta
- `POST /api/autenticacao/entrar` com credenciais válidas (use `usuarioTeste.email` e `usuarioTeste.senha`)
- `POST /api/autenticacao/entrar` com senha incorreta

> **Sobre verificar mensagens de erro:** verificar o status code (ex: `400`) é sempre uma boa asserção. Verificar o texto exato da mensagem (ex: `"Senha deve ter no mínimo 6 caracteres"`) é mais frágil: se alguém reformular o texto no futuro, o teste quebra mesmo sem nada estar errado no comportamento. Uma alternativa mais robusta é verificar apenas que o campo `message` existe, sem fixar o conteúdo.

**Observação:** para estes testes, o *mock* do *middleware* não é necessário. As rotas `/registrar` e `/entrar` não exigem autenticação. Confirme em `server/src/routes/autenticacao.routes.ts`.

**Lembrete de estrutura:** assim como em `tarefa.routes.test.ts`, este arquivo precisa de `beforeAll` e `afterAll` para configurar e desconectar o banco de teste. Use o mesmo padrão com `configurarBancoDeTeste` e `desconectarBancoDeTeste` importados de `../setup.test.db`.

### Atividade 5: Testes de API para estatísticas

Crie testes para o `GET /api/tarefas/estatisticas` em `tarefa.routes.test.ts` (ou em um arquivo separado). Sugestões:

- Crie algumas tarefas via POST antes de chamar o *endpoint* de estatísticas
- Verifique que a resposta contém os campos `total`, `concluidas`, `pendentes`, `atrasadas`, `porPrioridade` e `vencendoEm7Dias`
- Atualize uma tarefa como concluída e verifique se o contador `concluidas` muda
- Crie uma tarefa com data de vencimento no passado e verifique se `atrasadas` aumenta

Lembre: o *endpoint* requer autenticação, então o *mock* do *middleware* se aplica aqui.

---

## Fechamento

Nesta aula você saiu do teste manual e escreveu testes automatizados em dois níveis:

- **Testes unitários com Jest:** testaram funções puras de forma isolada, sem banco de dados e sem rede. São rápidos, previsíveis e fáceis de depurar porque cada teste verifica uma coisa só.
- **Testes de integração com Supertest:** testaram os *endpoints* da API de ponta a ponta, passando por roteamento, *middleware*, lógica de negócio e banco de dados. Confirmaram que as peças da aplicação funcionam juntas.

Alguns conceitos que atravessaram a aula:

- **Arrange-Act-Assert:** organiza cada teste em preparar os dados, executar a ação e verificar o resultado
- ***Mock*:** substitui uma dependência real por uma versão controlada para isolar o que está sendo testado
- **Banco de teste separado:** garante isolamento entre os dados de desenvolvimento e os dados dos testes
- **Cobertura de código:** mede o que foi executado, não o que foi verificado corretamente; alta cobertura é um bom sinal, mas não garante que os testes são bons
