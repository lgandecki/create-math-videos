from manim import *

class DivisibilityByThree(Scene):
    def construct(self):
        # Title
        title = Text("Divisibility by 3 Rule", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Display the large number
        number = Text("582", font_size=72, color=WHITE)
        self.play(Write(number))
        self.wait(1)
        
        # Animate separating digits
        digit_5 = Text("5", font_size=72, color=GREEN)
        digit_8 = Text("8", font_size=72, color=GREEN)
        digit_2 = Text("2", font_size=72, color=GREEN)
        
        # Position digits
        digit_5.shift(LEFT * 2)
        digit_8.shift(ORIGIN)
        digit_2.shift(RIGHT * 2)
        
        # Transform the original number into separated digits
        self.play(
            Transform(number, VGroup(digit_5, digit_8, digit_2)),
            run_time=2
        )
        self.wait(1)
        
        # Show the addition
        addition_text = Text("5 + 8 + 2", font_size=48, color=YELLOW)
        addition_text.shift(DOWN * 1)
        self.play(Write(addition_text))
        self.wait(1)
        
        # Animate the sum appearing
        equals_sum = Text("= 15", font_size=48, color=YELLOW)
        equals_sum.next_to(addition_text, RIGHT, buff=0.5)
        self.play(Write(equals_sum))
        self.wait(1)
        
        # Move everything up to make room
        group_so_far = VGroup(number, addition_text, equals_sum)
        self.play(group_so_far.animate.shift(UP * 1))
        self.wait(0.5)
        
        # Check if sum is divisible by 3
        question = Text("Is 15 divisible by 3?", font_size=36, color=ORANGE)
        question.shift(DOWN * 0.5)
        self.play(Write(question))
        self.wait(1)
        
        # Show division
        division = Text("15 ÷ 3 = 5", font_size=36, color=GREEN)
        division.shift(DOWN * 1.5)
        self.play(Write(division))
        self.wait(1)
        
        # Conclusion
        conclusion = Text("Since 15 is divisible by 3,", font_size=32, color=WHITE)
        conclusion2 = Text("the original number 582 is also divisible by 3!", font_size=32, color=WHITE)
        conclusion.shift(DOWN * 2.5)
        conclusion2.shift(DOWN * 3)
        
        self.play(Write(conclusion))
        self.wait(0.5)
        self.play(Write(conclusion2))
        self.wait(1)
        
        # Verify with original number
        verification = Text("582 ÷ 3 = 194", font_size=36, color=BLUE)
        verification.shift(DOWN * 3.7)
        self.play(Write(verification))
        self.wait(2)
        
        # Fade out everything
        all_objects = VGroup(title, number, addition_text, equals_sum, question, division, conclusion, conclusion2, verification)
        self.play(FadeOut(all_objects))
        self.wait(1)