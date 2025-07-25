import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Plus, Filter, Download, Eye, Calendar, User, CheckCircle, Clock, AlertTriangle, Pause } from 'lucide-react'
import { format } from 'date-fns'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import './App.css'

const PRIORIDADES = [
  { value: 'urgente', label: 'Urgente', color: 'bg-red-500' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-500' },
  { value: 'media', label: 'Média', color: 'bg-yellow-500' },
  { value: 'baixa', label: 'Baixa', color: 'bg-green-500' }
]

const STATUS = [
  { value: 'pendente', label: 'Pendente', color: 'bg-gray-500', icon: Clock },
  { value: 'andamento', label: 'Em andamento', color: 'bg-blue-500', icon: Eye },
  { value: 'concluida', label: 'Concluída', color: 'bg-green-500', icon: CheckCircle },
  { value: 'aguardando', label: 'Aguardando Terceiros', color: 'bg-purple-500', icon: Pause }
]

const AREAS = [
  'Redes Sociais',
  'Delivery',
  'Gráfico/Design',
  'Trade/Operacional',
  'Estratégia',
  'Desenvolvimento Pessoal'
]

function App() {
  const [tarefas, setTarefas] = useState([
    {
      id: 1,
      tarefa: 'Criar campanha para redes sociais',
      prioridade: 'alta',
      status: 'andamento',
      prazo: '2025-07-30',
      area: 'Redes Sociais',
      responsavel: 'Maria Silva',
      comentarios: 'Focar no Instagram e Facebook',
      dataCriacao: new Date(),
      dataConclusao: null
    },
    {
      id: 2,
      tarefa: 'Atualizar cardápio delivery',
      prioridade: 'urgente',
      status: 'pendente',
      prazo: '2025-07-25',
      area: 'Delivery',
      responsavel: 'João Santos',
      comentarios: 'Incluir novos pratos da temporada',
      dataCriacao: new Date(),
      dataConclusao: null
    }
  ])
  
  const [filtros, setFiltros] = useState({
    prioridade: '',
    status: '',
    area: ''
  })
  
  const [visualizacao, setVisualizacao] = useState('tabela')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [novaTarefa, setNovaTarefa] = useState({
    tarefa: '',
    prioridade: '',
    status: 'pendente',
    prazo: format(new Date(), 'yyyy-MM-dd'),
    area: '',
    responsavel: '',
    comentarios: '',
    dataCriacao: new Date(),
    dataConclusao: null
  })

  // Carregar tarefas do localStorage
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem('tarefas-braza')
    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas))
    }
  }, [])

  // Salvar tarefas no localStorage
  useEffect(() => {
    localStorage.setItem('tarefas-braza', JSON.stringify(tarefas))
  }, [tarefas])

  const adicionarTarefa = () => {
    if (!novaTarefa.tarefa || !novaTarefa.prioridade || !novaTarefa.area || !novaTarefa.responsavel) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const tarefa = {
      ...novaTarefa,
      id: Date.now(),
      dataCriacao: new Date(),
      dataConclusao: novaTarefa.status === 'concluida' ? new Date() : null
    }

    setTarefas([...tarefas, tarefa])
    setNovaTarefa({
      tarefa: '',
      prioridade: '',
      status: 'pendente',
      prazo: format(new Date(), 'yyyy-MM-dd'),
      area: '',
      responsavel: '',
      comentarios: '',
      dataCriacao: new Date(),
      dataConclusao: null
    })
    setDialogAberto(false)
  }

  const marcarConcluida = (id) => {
    setTarefas(tarefas.map(tarefa => 
      tarefa.id === id 
        ? { ...tarefa, status: 'concluida', dataConclusao: new Date() }
        : tarefa
    ))
  }

  const tarefasFiltradas = tarefas.filter(tarefa => {
    return (
      (!filtros.prioridade || tarefa.prioridade === filtros.prioridade) &&
      (!filtros.status || tarefa.status === filtros.status) &&
      (!filtros.area || tarefa.area === filtros.area)
    )
  })

  const exportarPDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4')
    
    // Título
    doc.setFontSize(16)
    doc.text('Gestão à Vista – Marketing Braza', 20, 20)
    doc.setFontSize(10)
    doc.text(`Relatório gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 30)

    // Preparar dados para a tabela
    const dados = tarefasFiltradas.map(tarefa => [
      tarefa.tarefa,
      PRIORIDADES.find(p => p.value === tarefa.prioridade)?.label || '',
      STATUS.find(s => s.value === tarefa.status)?.label || '',
      format(new Date(tarefa.prazo), 'dd/MM/yyyy'),
      tarefa.area,
      tarefa.responsavel,
      tarefa.comentarios
    ])

    // Criar tabela
    doc.autoTable({
      head: [['Tarefa', 'Prioridade', 'Status', 'Prazo', 'Área/Setor', 'Responsável', 'Comentários']],
      body: dados,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 },
        6: { cellWidth: 40 }
      }
    })

    doc.save('gestao-tarefas-braza.pdf')
  }

  const exportarExcel = () => {
    const dados = tarefasFiltradas.map(tarefa => ({
      'Tarefa': tarefa.tarefa,
      'Prioridade': PRIORIDADES.find(p => p.value === tarefa.prioridade)?.label || '',
      'Status': STATUS.find(s => s.value === tarefa.status)?.label || '',
      'Prazo': format(new Date(tarefa.prazo), 'dd/MM/yyyy'),
      'Área/Setor': tarefa.area,
      'Responsável': tarefa.responsavel,
      'Comentários': tarefa.comentarios,
      'Data Criação': format(new Date(tarefa.dataCriacao), 'dd/MM/yyyy'),
      'Data Conclusão': tarefa.dataConclusao ? format(new Date(tarefa.dataConclusao), 'dd/MM/yyyy') : ''
    }))

    const ws = XLSX.utils.json_to_sheet(dados)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tarefas Marketing Braza')
    XLSX.writeFile(wb, 'gestao-tarefas-braza.xlsx')
  }

  const getPrioridadeColor = (prioridade) => {
    return PRIORIDADES.find(p => p.value === prioridade)?.color || 'bg-gray-500'
  }

  const getStatusInfo = (status) => {
    return STATUS.find(s => s.value === status) || STATUS[0]
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 print:p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 print:shadow-none print:border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">
                Gestão à Vista – Marketing Braza
              </h1>
              <p className="text-gray-600 mt-1">
                Painel de acompanhamento de tarefas da equipa de marketing
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 print:hidden">
              <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="tarefa">Tarefa *</Label>
                      <Input
                        id="tarefa"
                        value={novaTarefa.tarefa}
                        onChange={(e) => setNovaTarefa({...novaTarefa, tarefa: e.target.value})}
                        placeholder="Descreva a tarefa..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prioridade">Prioridade *</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={novaTarefa.prioridade} 
                        onChange={(e) => setNovaTarefa({...novaTarefa, prioridade: e.target.value})}
                      >
                        <option value="">Selecione a prioridade</option>
                        {PRIORIDADES.map(prioridade => (
                          <option key={prioridade.value} value={prioridade.value}>
                            {prioridade.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={novaTarefa.status} 
                        onChange={(e) => setNovaTarefa({...novaTarefa, status: e.target.value})}
                      >
                        {STATUS.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="prazo">Prazo</Label>
                      <Input
                        id="prazo"
                        type="date"
                        value={novaTarefa.prazo}
                        onChange={(e) => setNovaTarefa({...novaTarefa, prazo: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="area">Área/Setor *</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={novaTarefa.area} 
                        onChange={(e) => setNovaTarefa({...novaTarefa, area: e.target.value})}
                      >
                        <option value="">Selecione a área</option>
                        {AREAS.map(area => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="responsavel">Responsável *</Label>
                      <Input
                        id="responsavel"
                        value={novaTarefa.responsavel}
                        onChange={(e) => setNovaTarefa({...novaTarefa, responsavel: e.target.value})}
                        placeholder="Nome do responsável"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="comentarios">Comentários/Observações</Label>
                      <Textarea
                        id="comentarios"
                        value={novaTarefa.comentarios}
                        onChange={(e) => setNovaTarefa({...novaTarefa, comentarios: e.target.value})}
                        placeholder="Observações adicionais..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setDialogAberto(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={adicionarTarefa} className="bg-blue-600 hover:bg-blue-700">
                      Adicionar Tarefa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={exportarPDF}>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              
              <Button variant="outline" onClick={exportarExcel}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros e Controles */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <div className="flex flex-wrap gap-4 flex-1">
              <select 
                className="w-40 p-2 border rounded-md"
                value={filtros.prioridade} 
                onChange={(e) => setFiltros({...filtros, prioridade: e.target.value})}
              >
                <option value="">Todas as prioridades</option>
                {PRIORIDADES.map(prioridade => (
                  <option key={prioridade.value} value={prioridade.value}>
                    {prioridade.label}
                  </option>
                ))}
              </select>

              <select 
                className="w-40 p-2 border rounded-md"
                value={filtros.status} 
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              >
                <option value="">Todos os status</option>
                {STATUS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <select 
                className="w-40 p-2 border rounded-md"
                value={filtros.area} 
                onChange={(e) => setFiltros({...filtros, area: e.target.value})}
              >
                <option value="">Todas as áreas</option>
                {AREAS.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <Button 
                variant="outline" 
                onClick={() => setFiltros({ prioridade: '', status: '', area: '' })}
                className="text-sm"
              >
                Limpar Filtros
              </Button>
            </div>

            <Tabs value={visualizacao} onValueChange={setVisualizacao} className="w-auto">
              <TabsList>
                <TabsTrigger value="tabela">Tabela</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <Tabs value={visualizacao} onValueChange={setVisualizacao}>
          <TabsContent value="tabela">
            <Card>
              <CardHeader className="print:hidden">
                <CardTitle className="flex items-center justify-between">
                  <span>Lista de Tarefas ({tarefasFiltradas.length})</span>
                  <span className="text-sm font-normal text-gray-500">
                    Atualizado em: {format(new Date(), 'dd/MM/yyyy HH:mm')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Tarefa</TableHead>
                        <TableHead className="w-[100px]">Prioridade</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[100px]">Prazo</TableHead>
                        <TableHead className="w-[150px]">Área/Setor</TableHead>
                        <TableHead className="w-[120px]">Responsável</TableHead>
                        <TableHead className="w-[200px]">Comentários</TableHead>
                        <TableHead className="w-[100px] print:hidden">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tarefasFiltradas.map((tarefa) => {
                        const statusInfo = getStatusInfo(tarefa.status)
                        const StatusIcon = statusInfo.icon
                        
                        return (
                          <TableRow key={tarefa.id}>
                            <TableCell className="font-medium">{tarefa.tarefa}</TableCell>
                            <TableCell>
                              <Badge className={`${getPrioridadeColor(tarefa.prioridade)} text-white`}>
                                {PRIORIDADES.find(p => p.value === tarefa.prioridade)?.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <StatusIcon className="w-4 h-4" />
                                <Badge className={`${statusInfo.color} text-white`}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {format(new Date(tarefa.prazo), 'dd/MM/yyyy')}
                              </div>
                            </TableCell>
                            <TableCell>{tarefa.area}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4 text-gray-400" />
                                {tarefa.responsavel}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={tarefa.comentarios}>
                              {tarefa.comentarios}
                            </TableCell>
                            <TableCell className="print:hidden">
                              {tarefa.status !== 'concluida' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => marcarConcluida(tarefa.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {tarefasFiltradas.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma tarefa encontrada com os filtros aplicados.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kanban">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATUS.map((status) => {
                const tarefasStatus = tarefasFiltradas.filter(tarefa => tarefa.status === status.value)
                const StatusIcon = status.icon
                
                return (
                  <Card key={status.value} className="h-fit">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                        <Badge variant="secondary" className="ml-auto">
                          {tarefasStatus.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tarefasStatus.map((tarefa) => (
                        <Card key={tarefa.id} className="p-3 border-l-4" style={{borderLeftColor: PRIORIDADES.find(p => p.value === tarefa.prioridade)?.color.replace('bg-', '#')}}>
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">{tarefa.tarefa}</h4>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{tarefa.area}</span>
                              <span>{format(new Date(tarefa.prazo), 'dd/MM')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className={`${getPrioridadeColor(tarefa.prioridade)} text-white text-xs`}>
                                {PRIORIDADES.find(p => p.value === tarefa.prioridade)?.label}
                              </Badge>
                              <span className="text-xs text-gray-600">{tarefa.responsavel}</span>
                            </div>
                            {tarefa.status !== 'concluida' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => marcarConcluida(tarefa.id)}
                                className="w-full text-green-600 hover:text-green-700 mt-2"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Marcar como Concluída
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                      
                      {tarefasStatus.length === 0 && (
                        <div className="text-center py-4 text-gray-400 text-sm">
                          Nenhuma tarefa
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

