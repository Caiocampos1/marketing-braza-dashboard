# Gestão à Vista – Marketing Braza

## Descrição
Painel de gestão de tarefas desenvolvido especificamente para a equipa de marketing do restaurante Braza. O sistema permite acompanhar, organizar e gerir todas as tarefas da equipa de forma visual e eficiente.

## Funcionalidades Principais

### ✅ Gestão de Tarefas
- **Adicionar Nova Tarefa**: Formulário completo com todos os campos necessários
- **Campos Obrigatórios**: Tarefa, Prioridade, Área/Setor e Responsável
- **Campos Opcionais**: Status, Prazo, Comentários/Observações
- **Marcação Automática**: Botão para marcar tarefas como concluídas com data automática

### 🎯 Categorização
- **Prioridades**: Urgente, Alta, Média, Baixa (com cores distintivas)
- **Status**: Pendente, Em andamento, Concluída, Aguardando Terceiros
- **Áreas/Setores**: 
  - Redes Sociais
  - Delivery
  - Gráfico/Design
  - Trade/Operacional
  - Estratégia
  - Desenvolvimento Pessoal

### 🔍 Filtros e Visualização
- **Filtros**: Por prioridade, status e área
- **Duas Visualizações**:
  - **Tabela**: Lista completa com todas as informações
  - **Kanban**: Organização visual por colunas de status

### 📊 Exportação
- **PDF**: Formato A4 horizontal otimizado para impressão
- **Excel**: Planilha completa com todos os dados
- **Ambos incluem**: Data de geração e filtros aplicados

### 🖨️ Otimização para Impressão
- **Layout Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Fontes Legíveis**: Otimizadas para leitura em papel
- **Cores Preservadas**: Mantém as cores dos badges na impressão
- **Formato A4 Horizontal**: Ideal para afixação em mural

## Como Usar

### Adicionar Nova Tarefa
1. Clique no botão "Nova Tarefa"
2. Preencha os campos obrigatórios (marcados com *)
3. Adicione comentários se necessário
4. Clique em "Adicionar Tarefa"

### Filtrar Tarefas
1. Use os filtros na barra superior
2. Selecione prioridade, status ou área
3. Clique em "Limpar Filtros" para remover todos os filtros

### Alternar Visualizações
- Clique em "Tabela" para ver lista completa
- Clique em "Kanban" para visualização por colunas

### Marcar como Concluída
- **Na Tabela**: Clique no botão com ícone de check na coluna "Ações"
- **No Kanban**: Clique no botão "Marcar como Concluída" no cartão da tarefa

### Exportar Dados
- **PDF**: Clique em "Exportar PDF" para gerar relatório em formato A4 horizontal
- **Excel**: Clique em "Exportar Excel" para baixar planilha completa

## Tecnologias Utilizadas
- **React**: Framework principal
- **Tailwind CSS**: Estilização
- **Lucide Icons**: Ícones
- **jsPDF**: Geração de PDF
- **XLSX**: Geração de Excel
- **date-fns**: Manipulação de datas

## Instalação e Execução

### Pré-requisitos
- Node.js 20+
- pnpm

### Comandos
```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## Características Técnicas

### Armazenamento
- **LocalStorage**: Os dados são salvos localmente no navegador
- **Persistência**: As tarefas são mantidas entre sessões

### Responsividade
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Adaptação dos filtros e tabela
- **Mobile**: Interface otimizada para toque

### Impressão
- **Formato**: A4 horizontal
- **Elementos Ocultos**: Botões e filtros não aparecem na impressão
- **Cores Preservadas**: Badges mantêm cores para identificação visual

## Suporte
Para dúvidas ou sugestões sobre o painel de gestão, consulte a documentação técnica ou entre em contacto com a equipa de desenvolvimento.

---

**Desenvolvido para o Restaurante Braza** | Versão 1.0 | 2025

