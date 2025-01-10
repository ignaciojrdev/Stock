import  ListCommands  from '../../components/Commands/ListCommands/ListCommands.tsx';
import './CommandPage.scss';

function CommandPage(){
    return (
        <>
            <div className='centering-titles'>
            <h1>Comanda</h1>
            </div>
            <hr></hr> 
            <div className='list-command-page'>
                <ListCommands />
            </div>
        </>
    );
}

export default CommandPage;