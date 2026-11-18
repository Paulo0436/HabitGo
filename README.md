# HabitGo 🌱

Bem-vindo ao repositório oficial do **HabitGo**!

O HabitGo é um aplicativo mobile desenvolvido para ajudar os usuários a organizar sua rotina, criar hábitos e acompanhar seu progresso diário.

O projeto foi desenvolvido para fins acadêmicos, na disciplina de **Programação para Dispositivos Móveis**, utilizando React Native, Expo e Firebase.

---

## 🌱 Sobre o Projeto

Criar novos hábitos é relativamente simples, mas manter a constância pode ser um desafio.

Muitas pessoas começam atividades como estudar, praticar exercícios, ler ou beber mais água, mas acabam perdendo o controle da frequência com que realizam essas tarefas.

Pensando nisso, surgiu o **HabitGo**, um aplicativo que permite organizar hábitos pessoais, acompanhar atividades realizadas e visualizar o progresso ao longo do tempo.

O objetivo é oferecer uma ferramenta simples e intuitiva que incentive a disciplina, a organização e a construção de uma rotina mais equilibrada.

---

## ⚙️ Como Funciona?

O HabitGo possui funcionalidades voltadas ao gerenciamento e acompanhamento de hábitos.

### 1. Gerenciamento de Hábitos

O usuário pode:

- Cadastrar novos hábitos.
- Visualizar os hábitos cadastrados.
- Editar informações de um hábito.
- Excluir hábitos que não deseja mais acompanhar.

Os dados são armazenados no Firebase Cloud Firestore.

### 2. Acompanhamento Diário

Na tela inicial, o usuário pode visualizar seus hábitos e marcar aqueles que já realizou durante o dia.

O aplicativo também apresenta uma barra de progresso, indicando a quantidade de hábitos concluídos em relação ao total cadastrado.

### 3. Progresso e Estatísticas

A aba Progresso permite acompanhar o desempenho dos hábitos registrados.

O usuário pode visualizar indicadores como:

- Quantidade de hábitos concluídos no dia.
- Percentual de progresso diário.
- Dias de sequência.
- Total de hábitos cadastrados.
- Histórico de conclusão dos últimos sete dias.

### 4. Notificações Personalizadas

O aplicativo permite configurar lembretes individuais para cada hábito.

O usuário pode:

- Ativar ou desativar notificações.
- Definir horários específicos.
- Configurar diferentes horários para diferentes hábitos.

As preferências são armazenadas localmente utilizando AsyncStorage.

**Observação:** o recebimento das notificações no Android ainda precisa ser validado em uma development build.

### 5. Autenticação Anônima

O HabitGo utiliza o Firebase Authentication para autenticar os usuários de forma anônima.

Isso permite utilizar o aplicativo sem precisar criar uma conta com e-mail e senha.

Cada usuário recebe um identificador único, utilizado para associar seus hábitos aos registros armazenados no Firestore.

---

## 📱 Telas do Aplicativo

O HabitGo possui quatro telas principais, desenvolvidas para facilitar a organização e o acompanhamento dos hábitos.

### 1. Início — Minha Rotina

A tela inicial apresenta os hábitos do dia e permite marcar as atividades concluídas. Também exibe uma barra de progresso com a quantidade de hábitos realizados e pendentes.

![Tela inicial do HabitGo](assets/screenshots/inicio.png)

### 2. Hábitos — Gerenciamento

Nesta tela, o usuário pode visualizar os hábitos cadastrados, adicionar novos hábitos e editar os registros existentes.

![Tela de gerenciamento de hábitos](assets/screenshots/habitos.png)

### 3. Progresso — Acompanhamento

A tela de progresso apresenta indicadores sobre o desempenho do usuário, incluindo hábitos concluídos, percentual de progresso diário, dias de sequência e quantidade de hábitos cadastrados.

![Tela de progresso do HabitGo](assets/screenshots/progresso.png)

### 4. Configurações — Notificações

A tela de configurações permite ativar ou desativar lembretes individuais e definir um horário específico para cada hábito.

![Tela de configurações do HabitGo](assets/screenshots/configuracoes.png)

---

## 💻 Tecnologias Utilizadas

As principais tecnologias utilizadas no desenvolvimento do HabitGo são:

- **React Native:** construção da interface do aplicativo.
- **Expo:** configuração, desenvolvimento e execução do projeto.
- **JavaScript:** implementação das funcionalidades.
- **Expo Router:** gerenciamento da navegação entre telas.
- **Firebase Authentication:** autenticação anônima.
- **Cloud Firestore:** armazenamento dos hábitos.
- **React Context API:** gerenciamento de estado global.
- **AsyncStorage:** armazenamento local das preferências.
- **Expo Notifications:** configuração e agendamento de lembretes.
- **Git e GitHub:** versionamento do código e gerenciamento de branches.

---

## 🔥 Tutorial de Configuração do Firebase

O HabitGo utiliza o Firebase para autenticar usuários e armazenar os hábitos na nuvem.

Para executar o aplicativo localmente, é necessário configurar um projeto Firebase.

### 1. Criar um projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/).
2. Clique em **Criar um projeto**.
3. Informe um nome, como `HabitGo`.
4. Siga as etapas de configuração.
5. Aguarde a criação do projeto.

O Google Analytics é opcional.

### 2. Registrar um aplicativo Web

O HabitGo utiliza o SDK JavaScript do Firebase.

Para obter as configurações de conexão:

1. No painel do Firebase, clique no ícone Web (`</>`).
2. Informe um nome, como `HabitGo Web`.
3. Clique em **Registrar app**.
4. Copie as informações do objeto `firebaseConfig`.

Exemplo:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

Esses dados serão utilizados na integração do aplicativo com o Firebase.

### 3. Habilitar o Firebase Authentication

O HabitGo utiliza autenticação anônima.

Para habilitar:

1. Acesse **Authentication** no menu lateral.
2. Clique em **Começar**.
3. Abra a aba **Sign-in method**.
4. Localize o provedor **Anônimo (Anonymous)**.
5. Ative a autenticação anônima.
6. Clique em **Salvar**.

Após essa configuração, o Firebase poderá autenticar os usuários automaticamente.

### 4. Criar o Cloud Firestore

O Firestore será responsável por armazenar os hábitos cadastrados.

1. No menu lateral, acesse **Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Escolha a localização do banco.
4. Selecione o **modo de produção**.
5. Finalize a criação.

O banco estará pronto para receber os dados após a configuração das regras de segurança.

### 5. Configurar as regras de segurança

No Firebase Console, acesse:

**Firestore Database → Regras (Rules)**

As regras devem permitir que cada usuário acesse somente seus próprios registros.

Por exemplo, para uma estrutura de dados organizada em `users/{userId}/habits/{habitId}`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId}/habits/{habitId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }

  }
}
```

**Importante:** essa regra é ilustrativa. É necessário adaptá-la à estrutura real das coleções do HabitGo, incluindo outros documentos utilizados pelo aplicativo.

Não utilize regras públicas que permitam acesso irrestrito aos dados.

Após configurar as regras, clique em **Publicar**.

### 6. Configurar as variáveis de ambiente

Na raiz do projeto, crie um arquivo chamado `.env`, caso ainda não exista.

Um exemplo de configuração é:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=SUA_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_PROJETO.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=SEU_APP_ID
```

Substitua os valores pelas informações fornecidas pelo Firebase Console.

**Atenção:** os nomes das variáveis precisam corresponder aos utilizados no código-fonte do aplicativo. As variáveis com prefixo `EXPO_PUBLIC_` ficam disponíveis no aplicativo e não devem armazenar senhas ou credenciais administrativas.

### 7. Verificar a integração

Após configurar o Firebase e executar o aplicativo:

1. Abra o HabitGo.
2. Cadastre um hábito.
3. Acesse o Firebase Console.
4. Entre em **Firestore Database → Dados**.
5. Verifique se o hábito foi armazenado.
6. Acesse **Authentication → Users**.
7. Confira se foi criado um usuário anônimo.

Se os registros forem exibidos corretamente, a integração básica com o Firebase estará funcionando.

---

## 🛠️ Como Executar o Projeto Localmente

Para executar o HabitGo em sua máquina, siga as etapas abaixo.

### 1. Clonar o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/Paulo0436/HabitGo.git
```

### 2. Acessar a pasta do projeto

```bash
cd HabitGo
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o Firebase

Siga o tutorial apresentado anteriormente para configurar:

- Firebase Authentication.
- Cloud Firestore.
- Regras de segurança.
- Variáveis de ambiente.

### 5. Iniciar o aplicativo

Execute:

```bash
npx expo start
```

O Expo iniciará o servidor de desenvolvimento.

### 6. Executar no Android

Com o Expo Go instalado no dispositivo, escaneie o QR Code exibido no terminal.

Também é possível utilizar um emulador Android configurado no computador.

**Observação:** algumas funcionalidades nativas, especialmente notificações, possuem limitações no Expo Go.

### 7. Executar no navegador

Para executar a versão Web:

```bash
npx expo start --web
```

Algumas funcionalidades nativas podem não estar disponíveis no navegador.

---

## 📲 É Possível Instalar o Aplicativo?

Atualmente, o HabitGo está disponível para execução em ambiente de desenvolvimento.

Ainda não foi disponibilizado um arquivo APK para instalação independente.

Durante a tentativa de gerar uma development build Android, foi identificado um erro de compilação relacionado à configuração de módulos nativos.

Essa etapa permanece como melhoria técnica futura.

---

## 🧪 Plano de Testes

O projeto contempla os seguintes cenários de teste:

| Funcionalidade | Cenário |
|---|---|
| Autenticação | Verificar a criação de usuário anônimo |
| Cadastro | Cadastrar um novo hábito |
| Listagem | Visualizar os hábitos cadastrados |
| Edição | Alterar informações de um hábito |
| Exclusão | Remover um hábito |
| Acompanhamento | Marcar um hábito como concluído |
| Progresso | Verificar a atualização do progresso diário |
| Persistência | Verificar os registros armazenados no Firestore |
| Navegação | Alternar entre as abas |
| Notificações | Configurar lembretes individuais |
| AsyncStorage | Verificar a persistência das preferências |

A validação do recebimento das notificações no Android permanece pendente.

---

## 🌿 Melhorias Futuras

Entre as melhorias planejadas para o HabitGo estão:

- Implementação de cadastro e login com e-mail e senha.
- Recuperação de senha.
- Aprimoramento das estatísticas de progresso.
- Validação completa das notificações no Android.
- Geração de um APK.
- Melhorias na experiência do usuário.

---

## 🌳 Organização do Desenvolvimento

O projeto utiliza Git e GitHub para controle de versões.

O desenvolvimento foi organizado utilizando o fluxo de branches:

- **main:** versão principal do projeto.
- **develop:** integração das funcionalidades.
- **feature/**: desenvolvimento de novas funcionalidades.

As alterações são integradas à branch `develop` por meio de Pull Requests.

Essa organização facilita o acompanhamento das entregas e o histórico de evolução do aplicativo.

---

## 🎓 Sobre o Projeto

O HabitGo foi desenvolvido como projeto acadêmico, com o objetivo de aplicar conhecimentos de desenvolvimento mobile, navegação, gerenciamento de estado, persistência de dados e integração com recursos nativos.

**Instituição:** Centro Universitário IESB

**Disciplina:** Programação para Dispositivos Móveis

**Professor:** Marcelo Alves Farias

**Desenvolvedor:** Paulo André Araújo de Souza

---

**HabitGo 🌱 — Um hábito de cada vez.**
