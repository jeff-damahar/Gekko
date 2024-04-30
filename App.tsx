import React from 'react';
import StackNvigator from './StackNvigator';
import { UserContext } from './UserContext';

function App(): React.JSX.Element {
  return(
    <UserContext>
         <StackNvigator/>
    </UserContext>
  )
}

export default App;
