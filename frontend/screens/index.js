import FormScreen from './FormScreen';
import HomeScreen from './HomeScreen';

const screens = [
  { id: 1, name: 'Home', title: 'Home', component: HomeScreen },
  { id: 2, name: 'users', title: 'User Form', component: FormScreen },
  { id: 3, name: 'tasks', title: 'Tasks Form', component: FormScreen },
];

export default screens;
