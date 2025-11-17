from manim import *

class QuadraticFormulaRecap(Scene):
    def construct(self):
        # Title section
        title = Text("Conclusion", font_size=56, color=BLUE)
        title.to_edge(UP, buff=0.5)
        
        # Main quadratic formula - prominently displayed
        formula = MathTex(
            r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
            font_size=72,
            color=WHITE
        )
        formula.center()
        
        # Summary text about the formula's power
        summary_text = Text(
            "This formula allows you to solve ANY quadratic equation,\nno matter how complex!",
            font_size=36,
            color=YELLOW,
            line_spacing=0.8
        )
        summary_text.next_to(formula, DOWN, buff=1.5)
        
        # Call to action text
        cta_text = Text(
            "Ready for more practice?\nExplore quadratic equations further!",
            font_size=32,
            color=GREEN,
            line_spacing=0.8
        )
        cta_text.to_edge(DOWN, buff=1)
        
        # Animation sequence
        # 1. Show title
        self.play(Write(title))
        self.wait(1)
        
        # 2. Display the quadratic formula prominently
        self.play(FadeIn(formula, shift=DOWN, scale=0.8))
        self.wait(2)
        
        # 3. Emphasize the formula with color change and slight scale
        self.play(
            formula.animate.set_color(BLUE).scale(1.1),
            run_time=1.5
        )
        self.wait(1)
        
        # 4. Return to normal and show summary
        self.play(
            formula.animate.set_color(WHITE).scale(1/1.1)
        )
        self.play(Write(summary_text))
        self.wait(3)
        
        # 5. Show call to action
        self.play(FadeIn(cta_text, shift=UP))
        self.wait(2)
        
        # 6. Final emphasis on the formula
        self.play(
            formula.animate.set_color(GOLD).scale(1.05),
            run_time=1
        )
        self.wait(2)
        
        # 7. Fade out everything except the formula for final focus
        self.play(
            FadeOut(title),
            FadeOut(summary_text),
            FadeOut(cta_text)
        )
        self.wait(1)
        
        # 8. Final fade out
        self.play(FadeOut(formula))
        self.wait(0.5)