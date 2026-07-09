let usuarios = []; 
let nextId = 1;


function buildUsuarioFromBody(body) {
  return {
    id: body.id || null,
    nome: body.nome || '',
    cpf: body.cpf || '',
    dataDeNascimento: body.dataDeNascimento || body.dataNascimento || '',
    email: body.email || '',
    telefone: body.telefone || '',
    logradouro: body.logradouro || '',
    numero: body.numero || '',
    complemento: body.complemento || '',
    bairro: body.bairro || '',
    cep: body.cep || '',
    cidade: body.cidade || '',
    estado: body.estado || '',
    sabendo: body.sabendo || '',
    integrantes: Array.isArray(body.integrantes) ? body.integrantes.map((m, idx) => ({
      id: m.id || null,
      nome: m.nome || '',
      cpf: m.cpf || '',
      dataDeNascimento: m.dataDeNascimento || m.dataNascimento || '',
      email: m.email || '',
    })) : []
  };
}

exports.createUsuario = (req, res) => {
  try {
    const body = req.body || {};
    const usuario = buildUsuarioFromBody(body);
    usuario.id = nextId++;
    usuario.integrantes = usuario.integrantes.map((m, i) => ({ ...m, id: `${usuario.id}-${i+1}` }));

    usuarios.push(usuario);
    return res.status(201).json({ message: 'Usuário criado com sucesso', usuario });
  } catch (err) {
    console.error('createUsuario error:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
};

exports.getUsuarios = (req, res) => {
  try {
    return res.json(usuarios);
  } catch (err) {
    console.error('getUsuarios error:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
};

exports.getUsuarioById = (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.json(usuario);
  } catch (err) {
    console.error('getUsuarioById error:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
};

exports.updateUsuario = (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado' });

    const body = req.body || {};
    const updated = buildUsuarioFromBody(body);
    updated.id = id;

    // preserve existing integrantes ids if not provided
    if (!Array.isArray(updated.integrantes) || updated.integrantes.length === 0) {
      updated.integrantes = usuarios[index].integrantes || [];
    } else {
      updated.integrantes = updated.integrantes.map((m, i) => ({
        id: m.id || `${id}-${i+1}`,
        nome: m.nome,
        cpf: m.cpf,
        dataDeNascimento: m.dataDeNascimento,
        email: m.email
      }));
    }

    usuarios[index] = updated;
    return res.json({ message: 'Usuário atualizado com sucesso', updated });
  } catch (err) {
    console.error('updateUsuario error:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
};

exports.deleteUsuario = (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado' });

    const removed = usuarios.splice(index, 1)[0];
    return res.json({ message: 'Usuário removido com sucesso', removed });
  } catch (err) {
    console.error('deleteUsuario error:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
};