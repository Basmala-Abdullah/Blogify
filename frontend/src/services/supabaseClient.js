import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// supabase authentication (login & register functions)
export const register = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password})
  return { data, error }
}

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password})
  return { data, error }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  return { user: data?.user, error }
}

//supabase database (posts CRUD operations)

export const getAllPosts = async (page = 1, pageSize = 5) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*, user_profiles:author(username)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
  
  return { 
    data, 
    error,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / pageSize)
  };
}

export const getUserPosts = async (user_id) => {
  const { data, error } = await supabase.from('posts').select('*').eq('author', user_id).order('updated_at', { ascending: false });
  return { data, error };
}

export const getPostById = async (id) => {
  const {data, error} = await supabase.from('posts').select('*').eq('id',id).single() //single is same for first but in supabase db
  return {data, error}
}

export const createPost = async(createdPost) =>{
  const {data, error}=await supabase.from('posts').insert([createdPost]).select()
  return {data, error}
}

export const updatePost = async (id, updatedPostData) => {
  const { data, error } = await supabase.from('posts').update(updatedPostData).eq('id',id)
  return { data, error }
}

export const deletePost = async (id) => {
  const { error } = await supabase.from('posts').delete().eq('id',id)
  return { error }
}