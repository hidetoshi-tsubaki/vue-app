<template>
  <div>
    <p>admin home</p>
    <div>
      <router-link to='/admin/quiz_levels'>Quiz Level</router-link>
      <router-link to='/admin/quiz_sections'>Quiz Section</router-link>
      <router-link to='/admin/quiz_titles'>Quiz Title</router-link>
      <router-link to='/admin/quizzes'>Quiz Index</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'adminHome'
}
</script>
