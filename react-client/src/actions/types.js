'use strict';

import RichTextEditor from 'react-rte';

export type Action =
    { type: 'FETCH_LESSONS', payload:any }
  | { type: 'UPDATE_NEW_LESSON', payload: { title:string, background:RichTextEditor } }
  | { type: 'SAVE_NEW_LESSON', payload: { title:string, background:string } }
  | { type: 'SAVE_LESSON', payload: { id: string, title:string, background:string } }
  | { type: 'LOGIN' }
  | { type: 'TOGGLE_NAVBAR' }
  | { type: 'FETCH_USERS', payload:any }
  | { type: 'DELETE_USER', payload:any }
  | { type: 'FETCH_QUESTIONS', payload:any };
