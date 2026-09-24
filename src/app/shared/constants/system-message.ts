export const SystemMessages = {

  loadError: (resource: string) =>
    `Não foi possível carregar ${resource}.`,

  createSuccess: (resource: string) =>
    `Cadastro de ${resource} realizado com sucesso.`,

  createError: (resource: string) =>
    `Não foi possível cadastrar ${resource}.`,

  updateSuccess: (resource: string) =>
    `Alteração de ${resource} realizada com sucesso.`,

  updateError: (resource: string) =>
    `Não foi possível alterar ${resource}.`,

  deleteSuccess: (resource: string) =>
    `Exclusão de ${resource} realizada com sucesso.`,

  deleteError: (resource: string) =>
    `Não foi possível excluir ${resource}.`,

  confirmationDelete: (resource: string) =>
    `Tem certeza que deseja excluir esta ${resource}?`

};
