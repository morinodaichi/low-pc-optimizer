// Uma chave de identificação única para nosso módulo
const MODULE_ID = 'low-pc-optimizer';

/**
 * Hook de Inicialização (init)
 * Usado para registrar configurações
 */
Hooks.once('init', () => {
  console.log('Low PC Optimizer | Inicializando...');

  // Registra a configuração principal do módulo
  game.settings.register(MODULE_ID, 'lowPcModeEnabled', {
    name: "Ativar Modo Low PC",
    hint: "Ativa otimizações agressivas de renderização. Reduz a qualidade gráfica para melhorar o FPS. (Requer recarregar a página)",
    scope: 'client',     // 'client' = cada jogador configura o seu
    config: true,        // 'true' = aparece no menu de configurações
    type: Boolean,
    default: false,
    onChange: (value) => {
      // Força o usuário a recarregar para que as mudanças mais profundas tenham efeito
      if (value) {
        Dialog.prompt({
          title: "Otimização Ativada",
          content: "<p>O Modo Low PC foi ativado. É altamente recomendado recarregar sua página (F5) para que todas as otimizações tenham efeito.</p>",
          label: "Recarregar Agora",
          callback: () => window.location.reload()
        });
      }
    }
  });

  // --- APLICA A OTIMIZAÇÃO #1 ---
  // Esta é uma das otimizações mais eficazes.
  // "Soft Shadows" (Sombras Suaves) são muito pesadas.
  // Se o modo Low PC estiver ligado, nós as desativamos ANTES do canvas ser desenhado.
  if (game.settings.get(MODULE_ID, 'lowPcModeEnabled')) {
    console.log('Low PC Optimizer | Otimização #1: Desativando Sombras Suaves.');
    // Esta configuração força o Foundry a usar um shader de iluminação muito mais simples.
    CONFIG.Canvas.simpleLightShader = true;
  }
});

/**
 * Hook de "Pronto" (ready)
 * Usado para lógica que precisa que o mundo esteja carregado
 */
Hooks.once('ready', () => {
  if (game.settings.get(MODULE_ID, 'lowPcModeEnabled')) {
    console.log('Low PC Optimizer | Otimização #2: Aplicando patches do libWrapper.');
    
    // Aqui é onde usaremos o libWrapper para "corrigir"
    // outras funções do Foundry ou de módulos.
    
    // Exemplo de Otimização: Desativar Animação de Visão
    // A animação suave quando a visão do token se move pode causar lag.
    if (libWrapper) {
      libWrapper.register(MODULE_ID, 'CONFIG.Token.objectClass.prototype.animateVision', function(wrapped, ...args) {
        // 'wrapped' é a função original.
        // Nós simplesmente não a chamamos, pulando a animação.
        return;
      }, 'OVERRIDE');
      
      console.log('Low PC Optimizer | Patch: Animação de Visão Desativada.');
    } else {
      ui.notifications.error("Low PC Optimizer requer o módulo 'libWrapper' para funcionar!");
    }
  }
});
