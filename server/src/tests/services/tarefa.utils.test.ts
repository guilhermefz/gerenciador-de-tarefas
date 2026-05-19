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
        concluida: true, // ← COMPLETE: qual valor faz a tarefa ser concluída?
      };
  
      const resultado = estaAtrasada(tarefa, hoje);
  
      expect(resultado).toBe(false); // ← COMPLETE: o que deve retornar?
    });
  
    it('deve retornar false para tarefa sem data de vencimento', () => {
      const tarefa = {
        dataVencimento: null, // ← COMPLETE: como representar "sem data"?
        concluida: false,
      };
  
      const resultado = estaAtrasada(tarefa, hoje);
  
      expect(resultado).toBe(false);
    });
  
    it('deve retornar false para tarefa com data futura', () => {
      const tarefa = {
        dataVencimento: new Date(2025, 5, 16), // ← COMPLETE: crie uma data posterior a 15/06/2025
        concluida: false,
      };
  
      const resultado = estaAtrasada(tarefa, hoje); // ← COMPLETE: qual função chamar?
  
      expect(resultado).toBe(false); // ← COMPLETE
    });
  });

  describe('diasParaVencimento', () => {
    const hoje = new Date('2025-06-15');
  
    it('deve retornar 5 para tarefa com vencimento daqui a 5 dias', () => {
      const dataVencimento = new Date('2025-06-20');
  
      const resultado = diasParaVencimento(dataVencimento, hoje);
  
      expect(resultado).toBe(5);
    });
  
    it('deve retornar valor negativo para tarefa vencida há 3 dias', () => {
      const dataVencimento = new Date('2025-06-12');
  
      const resultado = diasParaVencimento(dataVencimento, hoje);
  
      expect(resultado).toBe(-3);
    });
  
    it('deve retornar null para tarefa sem data de vencimento', () => {
      const resultado = diasParaVencimento(null, hoje);
  
      expect(resultado).toBeNull();
    });
  
    it('deve retornar 0 para tarefa com vencimento hoje', () => {
      const resultado = diasParaVencimento(hoje, hoje);
  
      expect(resultado).toBe(0);
    });
  });