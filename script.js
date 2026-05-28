const API = "https://tarefas-api-8ein.onrender.com/tarefas";

//Listar tarefas
function carregarTarefas() {
    
    const lista = document.getElementById("listaTarefas");
    const loading = document.getElementById("loading");

    loading.style.display = "block";

    fetch(API)
        .then(response => {
            if (!response.ok){
                throw new Error("Erro ao carregar tarefas");
            }

            return response.json()
        })

        .then(dados => {
            lista.innerHTML = "";

            dados.forEach(tarefa => {
                const item = document.createElement("li");

                item.innerHTML = `
                    <strong>${tarefa.titulo}</strong><br>
                    ${tarefa.descricao}<br>
                    ${tarefa.data}<br>
                    Status: ${tarefa.status}<br>
                    Concluída: ${tarefa.concluida ? "Sim" : "Não"}<br>

                    <button onclick="editar(
                        ${tarefa.id},
                        \`${tarefa.titulo}\`,
                        \`${tarefa.descricao}\`,
                        \`${tarefa.data}\`,
                        \`${tarefa.status}\`,
                        ${tarefa.concluida}
                    )">Editar</button>

                    <button onclick="deletar(${tarefa.id})">
                        X
                    </button>
                `;

                lista.appendChild(item);
            });
        })

        .catch(error => {
            console.error(error);

            lista.innerHTML = `
                <li>
                    Não foi possível carregar as tarefas.
                    <br>
                    O servidor pode estar iniciando.
                    <br><br>
                    Tente novamente em alguns segundos.
                </li>
            `;
        })

        .finally(() => {
            loading.style.display = "none";
        });
}

// CRIAR TAREFA
function criarTarefa(){
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const status = document.getElementById("status").value;
    const data = document.getElementById("data").value;
    const concluida = document.getElementById("concluida").checked;
    
    if(!titulo || !descricao){
        alert("Preencher todos os campos!");
        return;
    }

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo: titulo,
            descricao: descricao,
            data: data,
            status: status,
            concluida: concluida
        })
    })
    .then(() => {
        alert("Tarefa criada com sucesso!");
        carregarTarefas()});

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("data").value = "";
    document.getElementById("concluida").checked = false;
}

//EDITAR
function editar(id, titulo, descricao, data, status, concluida){
    const novoTitulo = prompt("Novo título:", titulo);
    const novaDescricao = prompt("Nova descrição:", descricao);

    if(!novoTitulo || !novaDescricao){
        alert ("Título e descrição são obrigatórios!");
        return;
    }

    fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo: novoTitulo,
            descricao: novaDescricao,
            data: data,
            status: status,
            concluida: concluida
        })
    })
    .then(response => {
        if(!response.ok){
            alert("Erro ao atualizar tarefa!");
            return;
        }
        carregarTarefas();
    });
}

//DELETAR
function deletar(id){
    if(confirm("Tem certeza que deseja deletar?")){
        fetch(`${API}/${id}`, {
            method: "DELETE"
        })
        .then(() => carregarTarefas());
    }
}

// CARREGAR AO ABRIR
carregarTarefas();