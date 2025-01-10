import { useEffect, useState } from 'react';
import './ListCommands.scss';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../../utils/Modais/Loading/LoadingSpinner/LoadingSpinner.tsx';
import axios from 'axios';
import { notifySuccess } from '../../../utils/Modais/Toast/Toasts.tsx';
import { notifyError } from '../../../utils/Modais/Toast/Toasts.tsx';
import { Command } from '../../../utils/Interfaces/Command.tsx';
import { Command_Filter } from '../../../utils/Interfaces/CommandFilter.tsx';


function ListCommands() {
  useEffect(() => {
    setEnvironmentData();
    fetchCommands(defaultFilterCommand());
  }, []);

  const [url, setUrl] = useState<string>();
  const [commandService, setCommandService] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [commands, setCommands] = useState<Command[]>([]);

  const [newCommandName, setNewCommandName] = useState<string>('');

  const [newCommandDate, setNewCommandDate] = useState<string>('');

  const [statusNewCommandValue, setStatusNewCommandValue] = useState('Aberta');
  const handleStatusNewCommandValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusNewCommandValue(event.target.value);
  };
  
  const [typeNewCommandValue, setTypeNewCommandValue] = useState('Pessoal');
  const handleTypeNewCommandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeNewCommandValue(event.target.value);
  };
  
  const [idFilterValue, setIdFilterValue] = useState('');
  const handleIdFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdFilterValue(event.target.value);
  };

  const [nameFilterValue, setNameFilterValue] = useState('');
  const handleNameFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilterValue(event.target.value);
  };

  const [statusFilterValue, setStatusFilterValue] = useState('T');
  const handleStatusFilterValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilterValue(event.target.value);
  };

  const [typeFilterValue, setTypeFilterValue] = useState('T');
  const handleTypeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilterValue(event.target.value);
  };

  const [dateFilterValue, setDateFilterValue] = useState<string>('');
  const handleDateFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilterValue(event.target.value);
  };

  const clearNewCommand = () => {
    setNewCommandName('');
    setNewCommandName('');
    setNewCommandDate('');
    setStatusNewCommandValue('Aberta');
    setTypeNewCommandValue('Pessoal');
  };

  const defaultFilterCommand = () => {
    const defaultFilter: Command_Filter = {
      id: '',
      name: '',
      status: 'T',
      type: 'T',
      createdAt: ''
    };
    return defaultFilter;
  };
  
  const setEnvironmentData = () => {
    let service = process.env.BACKEND_SALES_COMMAND || 'Sale/Command/';
    let urlBase = process.env.BACKEND_SALES || 'http://localhost:3201/';
    setUrl(urlBase);
    setCommandService(service);
  };

  const fetchCommands = async ( command_filter: Command_Filter ) =>{
    try {
      setIsLoading(true);
      let response = await axios.get('http://localhost:3201/'+'Sale/Command/', {
        params: {
          id: command_filter.id || '',
          name: command_filter.name || '',
          status: command_filter.status || '',
          createdAt: command_filter.createdAt || '',
          type: command_filter.type || ''
        }
      });
      let commands = response.data;
      setCommands(commands);
    } catch (error: any) {
      console.log(error);
    } finally{
      setIsLoading(false);
    }
  };

  const saveNewCommand = async (newCommand: Command) => {
    await axios.post(url!+commandService!, newCommand);
    fetchCommands(defaultFilterCommand()); 
  };

  const handleClickNewCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let newCommand:Command = {
      id: 0,
      name: newCommandName,
      status: statusNewCommandValue,
      createdAt: new Date(newCommandDate),
      type: typeNewCommandValue,
      valorTotal: 0,
    };
    try{
      await saveNewCommand(newCommand);
      notifySuccess(`A comanda ${newCommandName} foi criada com sucesso`);
    }catch(error: any){
      notifyError(error.response.data.message + " " + error.response.data.error);
    }
    clearNewCommand();
    setIsLoading(false);
  };

  const getParamsFilter = () => {
    const filter: Command_Filter = {
      id: idFilterValue, 
      name: nameFilterValue, 
      status: statusFilterValue, 
      createdAt: dateFilterValue,
      type: typeFilterValue
    };
    return filter;
  };

  const handleSearchCommands = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetchCommands(getParamsFilter());
    setIsLoading(false);
  };

  const dateCreateFormmat = (data: string | Date) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
  });
  }

  return (
    <>
      <div className='list-command-container'>
        <div className='list-commands-component-forms'>
          <div className='list-commands-component-filter'>
            <h3>Filtro das comandas</h3>
            <div id='title-field-filter' className='titulo-nome-field-filter'>
              <label htmlFor="idFiltroCommand">Código: </label>
              <input name="idFiltroCommand" type='number' min={1}  value={idFilterValue} onChange={handleIdFilterValue}></input>
            </div>
            <div id='title-field-filter' className='titulo-nome-field-filter'>
              <label htmlFor="textFiltroCommand">Título: </label>
              <input name="textFiltroCommand" type='text'  value={nameFilterValue} onChange={handleNameFilterValue}></input>
            </div>
            <div id='status-field-filter' className='status-field-filter'>
              <label htmlFor="statusFiltroCommand">Status: </label>
              <select name="statusFiltroCommand" value={statusFilterValue} onChange={handleStatusFilterValue}>
                <option value="T">Todos</option>
                <option value="Aberta">Aberta</option>
                <option value="Fechada">Fechada</option>
              </select>
            </div>
            <div id='type-field-filter' className='type-field-filter'>
              <label htmlFor="typeFiltroCommand">Tipo: </label>
              <select name="typeFiltroCommand" value={typeFilterValue} onChange={handleTypeFilterChange}>
                <option value="T">Todos</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Grupo">Grupo</option>
              </select>
            </div>
            <div id='date-field-filter' className='date-field-filter'>
              <label htmlFor="dateFiltroCommand">Data: </label>
              <input name="dateFiltroCommand" type='datetime-local' value={dateFilterValue} onChange={handleDateFilterValue}></input>
            </div>
            <div className="button-container">
              <button onClick={handleSearchCommands} type='submit'>Pesquisar</button>
            </div>
          </div>
          <hr style={{width:"75%"}}/>
          <div className='list-commands-component-new-command'>
            <h3>Nova comanda</h3>
            <div id='title-field-new-command' className='titulo-nome-field-filter'>
              <label htmlFor="textFiltroCommand">Título: </label>
              <input name="textFiltroCommand" type='text' value={newCommandName} onChange={(e) => setNewCommandName(e.target.value)}></input>
            </div>
            <div id='status-field-new-command' className='status-field-filter'>
              <label htmlFor="statusFiltroCommand">Status: </label>
              <select name="statusFiltroCommand"  value={statusNewCommandValue} onChange={handleStatusNewCommandValue}>
                <option value="Aberta">Aberta</option>
                <option value="Fechada">Fechada</option>
              </select>
            </div>
            <div id='type-field-new-command' className='type-field-filter'>
              <label htmlFor="typeFiltroCommand">Tipo: </label>
              <select name="typeFiltroCommand" value={typeNewCommandValue} onChange={handleTypeNewCommandChange}>
                <option value="Pessoal">Pessoal</option>
                <option value="Grupo">Grupo</option>
              </select>
            </div>
            <div id='date-field-new-command' className='date-field-filter'>
              <label htmlFor="dateFiltroCommand">Data: </label>
              <input name="dateFiltroCommand" type='datetime-local' value={newCommandDate} onChange={(e) => setNewCommandDate(e.target.value)}></input>
            </div>
            <div className="button-container">
              <button onClick={handleClickNewCommand} type='submit'>Salvar</button>
            </div>
          </div>
        </div>

        {commands.length > 0 ? 
          <div className='list-commands-component'>
            {
              commands.map((command) => (
                <Link key={command.id} to={""+command.id+"/"}>
                  {
                    command.status == 'Aberta' ? 
                    <div className='list-commands-component-ceil list-commands-component-ceil-open'>
                        <strong>{command.id}</strong>
                        <strong>{command.name}</strong>
                        <p>{command.status}</p>
                        <p>{dateCreateFormmat(command.createdAt)}</p>
                    </div>
                    :
                    <div className='list-commands-component-ceil list-commands-component-ceil-closed'>
                        <strong>{command.id}</strong>
                        <strong>{command.name}</strong>
                        <p>{command.status}</p>
                        <p>{dateCreateFormmat(command.createdAt)}</p>
                    </div>
                  }
                </Link>
              ))
            }
          </div>
          :
          <div className='list-commands-component comanda-vazia'>
            <h2>Não existem comandas a serem listadas.</h2>
          </div>
        }
        
        <LoadingSpinner  isLoading={isLoading} />
      </div>
    </>
  );
}

export default ListCommands;