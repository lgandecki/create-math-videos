from manim import *

class ZenoParadoxResolution(Scene):
    def construct(self):
        # Title
        title = Text("The Resolution: Finite Time, Infinite Steps", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Display the mathematical sum
        sum_equation = MathTex(
            r"\frac{1}{2}", r"+", r"\frac{1}{4}", r"+", r"\frac{1}{8}", r"+", r"\frac{1}{16}", r"+", r"\cdots"
        )
        sum_equation.set_color_by_tex(r"\frac{1}{2}", YELLOW)
        sum_equation.set_color_by_tex(r"\frac{1}{4}", GREEN)
        sum_equation.set_color_by_tex(r"\frac{1}{8}", ORANGE)
        sum_equation.set_color_by_tex(r"\frac{1}{16}", PINK)
        sum_equation.shift(UP)
        
        self.play(Write(sum_equation))
        self.wait(2)
        
        # Transform to equals 1
        equals_one = MathTex(r"= 1", color=RED)
        equals_one.next_to(sum_equation, RIGHT, buff=0.3)
        
        self.play(FadeIn(equals_one, shift=LEFT))
        self.wait(2)
        
        # First explanation text
        explanation1 = Text(
            "While there are an infinite number of steps Achilles must take,",
            font_size=28,
            color=WHITE
        )
        explanation1.shift(DOWN)
        
        explanation2 = Text(
            "the sum of those steps is a finite, measurable distance!",
            font_size=28,
            color=YELLOW
        )
        explanation2.next_to(explanation1, DOWN, buff=0.2)
        
        self.play(Write(explanation1))
        self.wait(1)
        self.play(Write(explanation2))
        self.wait(3)
        
        # Clear previous explanations
        self.play(FadeOut(explanation1), FadeOut(explanation2))
        
        # Time explanation
        time_text = Text(
            "Similarly, the time it takes to complete these infinite steps is also finite.",
            font_size=28,
            color=GREEN
        )
        time_text.shift(DOWN)
        
        self.play(Write(time_text))
        self.wait(3)
        
        # Clear time explanation
        self.play(FadeOut(time_text))
        
        # Final statement
        final_text1 = Text(
            "Achilles does catch the Tortoise!",
            font_size=32,
            color=GREEN
        )
        final_text1.shift(0.5 * DOWN)
        
        final_text2 = Text(
            "Zeno's paradox highlights the difference between mathematical",
            font_size=28,
            color=WHITE
        )
        final_text2.shift(1.5 * DOWN)
        
        final_text3 = Text(
            "abstraction and physical reality, and the powerful concept",
            font_size=28,
            color=WHITE
        )
        final_text3.next_to(final_text2, DOWN, buff=0.1)
        
        final_text4 = Text(
            "of converging infinite series.",
            font_size=28,
            color=BLUE
        )
        final_text4.next_to(final_text3, DOWN, buff=0.1)
        
        self.play(Write(final_text1))
        self.wait(1)
        self.play(Write(final_text2))
        self.play(Write(final_text3))
        self.play(Write(final_text4))
        self.wait(4)
        
        # Fade out everything
        self.play(
            FadeOut(title),
            FadeOut(sum_equation),
            FadeOut(equals_one),
            FadeOut(final_text1),
            FadeOut(final_text2),
            FadeOut(final_text3),
            FadeOut(final_text4)
        )
        self.wait(1)