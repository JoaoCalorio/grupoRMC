class Usuario {
    constructor({ id, nome, cpf, dataDeNascimento, email, telefone, logradouro, numero, complemento, bairro, cidade, estado, cep }) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.dataDeNascimento = dataDeNascimento;
        this.email = email;
        this.telefone = telefone;
        this.logradouro = logradouro;
        this.numero = numero;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
    }
}

module.exports = Usuario;