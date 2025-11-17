from manim import *

class DivisibilityRuleThree(Scene):
    def construct(self):
        # Title
        title = Text("The Divisibility Rule for 3", font_size=48, color=BLUE)
        title.to_edge(UP, buff=1)
        
        # Core question
        question = Text("Is a number divisible by 3?", font_size=36, color=WHITE)
        question.next_to(title, DOWN, buff=1)
        
        # The rule explanation
        rule = Text(
            "A number is divisible by 3 if the sum of its digits is divisible by 3.",
            font_size=32,
            color=GREEN
        )
        rule.next_to(question, DOWN, buff=1.5)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        self.play(Write(question))
        self.wait(1)
        
        self.play(Write(rule))
        self.wait(2)
        
        # Keep everything on screen for a moment
        self.wait(2)