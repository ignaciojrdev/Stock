import './MovementPage.scss';
import Movements from '../../components/Movement/Movement.tsx';
function MovementPage(){
    return (
        <>
            <div className='centering-titles'>
                <h1>Movimentações do estoque</h1>
            </div>
            <hr></hr> 
            <div>
                <Movements />
            </div>
        </>
    );
}

export default MovementPage;