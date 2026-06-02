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
                const dataFormatada = new Date(tarefa.data).toLocaleDateString("pt-BR");

                let classeStatus= "";

                if(tarefa.status === "PENDENTE"){
                    classeStatus = "status-pendente";
                }else if(tarefa.status === "EM_ANDAMENTO"){
                    classeStatus = "status-andamento";
                }else if(tarefa.status === "CONCLUIDO"){
                    classeStatus = "status-concluido";
                }

                item.classList.add("tarefa-card");
                item.innerHTML = `
                    <div class="info-tarefa">
                        <strong>${tarefa.titulo}</strong><br>
                        ${tarefa.descricao}<br>
                        ${dataFormatada}<br>
                    </div>
                    
                    <div class="${classeStatus}">
                        ${tarefa.status.replace("_", " ")}
                    </div>
                    <div class="acoes">
                        <button class="btn-concluir" onclick= "concluirTarefa(
                            ${tarefa.id},
                            \`${tarefa.titulo}\`,
                            \`${tarefa.descricao}\`,
                            \`${tarefa.data}\`
                        )">
                            ${tarefa.concluida ? "Concluido ✓" : "Concluir"}
                        </button>
                        <button class="btn-editar" onclick="editar(
                            ${tarefa.id},
                            \`${tarefa.titulo}\`,
                            \`${tarefa.descricao}\`,
                            \`${tarefa.data}\`,
                            \`${tarefa.status}\`,
                            ${tarefa.concluida}
                        )">Editar</button>

                        <button class="btn-excluir" onclick="deletar(${tarefa.id})">
                            Excluir
                        </button>
                    </div>
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
    
    if(!titulo || !descricao || !data){
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
            concluida: false
        })
    })
    .then(() => {
        alert("Tarefa criada com sucesso!");
        carregarTarefas()});

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("data").value = "";
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

function concluirTarefa(id, titulo, descricao, data){

    const dados = {
        titulo: titulo,
        descricao: descricao,
        data: data,
        status: "CONCLUIDO",
        concluida: true
    };
    console.log(dados);

    fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(async response => {

        if(!response.ok){

            const erro = await response.text();
            console.log("ERRO BACKEND:", erro);

            throw new Error("Erro ao concluir tarefa");
        }

        carregarTarefas();
    })
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