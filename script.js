document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        nome: document.getElementById('nome').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        // Removido o campo Idade
        // idade: document.getElementById('idade').value,
        sexo: document.getElementById('sexo').value,
        telefones: document.getElementById('telefones').value,
        email: document.getElementById('email').value,
        conjuge: document.getElementById('conjuge').value,
        pai: document.getElementById('pai').value,
        mae: document.getElementById('mae').value,
        quantidadeFilhos: document.getElementById('quantidadeFilhos').value
        // Removido o campo Cargo
        // cargo: document.getElementById('cargo').value
    };

    try {
        const response = await fetch('http://localhost:5000/pessoas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('Resposta da API:', result); // Log para verificar a resposta da API
        document.getElementById('message').innerText = result.message;

        // Armazenar o ID da pessoa cadastrada e o sexo
        const pessoaId = result.pessoaId;
        const sexo = result.sexo;

        // Gerar campos de cadastro de filhos
        const filhosContainer = document.getElementById('filhosContainer');
        filhosContainer.innerHTML = ''; // Limpar campos anteriores
        for (let i = 0; i < formData.quantidadeFilhos; i++) {
            const filhoDiv = document.createElement('div');
            filhoDiv.classList.add('filho');

            const labelNome = document.createElement('label');
            labelNome.textContent = `Nome do Filho ${i + 1}:`;
            filhoDiv.appendChild(labelNome);

            const inputNome = document.createElement('input');
            inputNome.type = 'text';
            inputNome.name = `nomeFilho${i}`;
            inputNome.required = true;
            filhoDiv.appendChild(inputNome);

            const labelDataNascimento = document.createElement('label');
            labelDataNascimento.textContent = `Data de Nascimento do Filho ${i + 1}:`;
            filhoDiv.appendChild(labelDataNascimento);

            const inputDataNascimento = document.createElement('input');
            inputDataNascimento.type = 'date';
            inputDataNascimento.name = `dataNascimentoFilho${i}`;
            inputDataNascimento.required = true;
            filhoDiv.appendChild(inputDataNascimento);

            // Adicionar campos ocultos para armazenar os IDs do pai e da mãe
            const inputPaiId = document.createElement('input');
            inputPaiId.type = 'hidden';
            inputPaiId.name = `paiId${i}`;
            inputPaiId.value = sexo === 'M' ? pessoaId : ''; // Definir paiId se sexo for masculino
            filhoDiv.appendChild(inputPaiId);

            const inputMaeId = document.createElement('input');
            inputMaeId.type = 'hidden';
            inputMaeId.name = `maeId${i}`;
            inputMaeId.value = sexo === 'F' ? pessoaId : ''; // Definir maeId se sexo for feminino
            filhoDiv.appendChild(inputMaeId);

            filhosContainer.appendChild(filhoDiv);
        }

        // Resetar o formulário após o cadastro
        document.getElementById('cadastroForm').reset();
    } catch (error) {
        document.getElementById('message').innerText = 'Erro ao cadastrar pessoa';
        console.error('Erro:', error);
    }
});

document.getElementById('cadastroFilhoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const filhosContainer = document.getElementById('filhosContainer');
    const filhos = filhosContainer.querySelectorAll('.filho');
    const formData = [];

    filhos.forEach((filho, index) => {
        formData.push({
            nomeFilho: filho.querySelector(`input[name="nomeFilho${index}"]`).value,
            dataNascimentoFilho: filho.querySelector(`input[name="dataNascimentoFilho${index}"]`).value,
            paiId: filho.querySelector(`input[name="paiId${index}"]`).value || null,
            maeId: filho.querySelector(`input[name="maeId${index}"]`).value || null
        });
    });

    try {
        const response = await fetch('http://localhost:5000/filhos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('Resposta da API:', result); // Log para verificar a resposta da API
        document.getElementById('messageFilho').innerText = result.message;

        // Resetar o formulário após o cadastro
        document.getElementById('cadastroFilhoForm').reset();
    } catch (error) {
        document.getElementById('messageFilho').innerText = 'Erro ao cadastrar filho';
        console.error('Erro:', error);
    }
});

// Removida a função para carregar opções de cargos dinamicamente
// async function carregarCargos() {
//     try {
//         const response = await fetch('http://localhost:5000/cargos');
//         const cargos = await response.json();
//         const cargoSelect = document.getElementById('cargo');
//         cargoSelect.innerHTML = ''; // Limpar opções anteriores
//         cargos.forEach(cargo => {
//             const option = document.createElement('option');
//             option.value = cargo.ID;
//             option.textContent = cargo.NOME;
//             cargoSelect.appendChild(option);
//         });
//     } catch (error) {
//         console.error('Erro ao carregar cargos:', error);
//     }
// }

// Removido o carregamento de opções ao carregar a página
// document.addEventListener('DOMContentLoaded', carregarCargos);