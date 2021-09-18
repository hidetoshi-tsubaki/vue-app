<template>
  <div>
    <MyTextarea
      v-model="quiz.Question"
      label="Question"
      v-bind="questionRules"
    />
    <MyInput
      v-model="quiz.Answer"
      label="Answer"
      v-bind="choiceRules"
    />
    <MyInput
      v-model="quiz.Choice1"
      label="Choice1"
      v-bind="choiceRules"
    />
    <MyInput
      v-model="quiz.Choice2"
      label="Choice2"
      v-bind="choiceRules"
    />
    <MyInput
      v-model="quiz.Choice3"
      label="Choice3"
      v-bind="choiceRules"
    />
  </div>
</template>

<script>
import MyTextarea from '@/components/parts/form/MyTextarea'
import MyInput from '@/components/parts/form/MyInput'
export default {
  name: "MyQuizForm",
  components: {
    MyTextarea,
    MyInput
  },
  props: {
    value: { type: Object, required: true }
  },
  data: () => ({
    questionRules: {
      max: 300,
      required: true
    },
    choiceRules: {
      max: 150,
      required: true
    },
  }),
  computed: {
    quiz: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit("input", value)
      }
    }
  }
}
</script>
