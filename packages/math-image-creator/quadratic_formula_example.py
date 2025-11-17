from manim import *

class QuadraticFormulaExample(Scene):
    def construct(self):
        # Title
        title = Text("Quadratic Formula Example", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Display the example equation
        equation = MathTex("2x^2 + 5x - 3 = 0", font_size=48)
        equation.next_to(title, DOWN, buff=1)
        self.play(Write(equation))
        self.wait(2)
        
        # Identify coefficients
        coeff_text = Text("Identify the coefficients:", font_size=36)
        coeff_text.next_to(equation, DOWN, buff=0.8)
        self.play(Write(coeff_text))
        
        coefficients = VGroup(
            MathTex("a = 2", font_size=36, color=GREEN),
            MathTex("b = 5", font_size=36, color=GREEN),
            MathTex("c = -3", font_size=36, color=GREEN)
        )
        coefficients.arrange(RIGHT, buff=1)
        coefficients.next_to(coeff_text, DOWN, buff=0.5)
        self.play(Write(coefficients))
        self.wait(2)
        
        # Clear screen and show quadratic formula template
        self.play(FadeOut(VGroup(equation, coeff_text, coefficients)))
        
        formula_title = Text("Quadratic Formula:", font_size=36)
        formula_title.next_to(title, DOWN, buff=0.8)
        
        formula_template = MathTex(
            r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
            font_size=48
        )
        formula_template.next_to(formula_title, DOWN, buff=0.8)
        
        self.play(Write(formula_title))
        self.play(Write(formula_template))
        self.wait(2)
        
        # Animate substitution
        substitution_text = Text("Substitute the values:", font_size=32)
        substitution_text.next_to(formula_template, DOWN, buff=0.8)
        self.play(Write(substitution_text))
        
        substituted_formula = MathTex(
            r"x = \frac{-(5) \pm \sqrt{(5)^2 - 4(2)(-3)}}{2(2)}",
            font_size=40
        )
        substituted_formula.next_to(substitution_text, DOWN, buff=0.5)
        self.play(Write(substituted_formula))
        self.wait(2)
        
        # Clear and show discriminant calculation
        self.play(FadeOut(VGroup(formula_title, formula_template, substitution_text)))
        
        disc_title = Text("Calculate the discriminant:", font_size=36)
        disc_title.next_to(title, DOWN, buff=0.8)
        self.play(Write(disc_title))
        
        # Step by step discriminant calculation
        step1 = MathTex("5^2 = 25", font_size=36)
        step1.next_to(disc_title, DOWN, buff=0.5)
        self.play(Write(step1))
        self.wait(1)
        
        step2 = MathTex("4(2)(-3) = -24", font_size=36)
        step2.next_to(step1, DOWN, buff=0.3)
        self.play(Write(step2))
        self.wait(1)
        
        step3 = MathTex("25 - (-24) = 25 + 24 = 49", font_size=36)
        step3.next_to(step2, DOWN, buff=0.3)
        self.play(Write(step3))
        self.wait(2)
        
        # Show simplified formula
        simplified_formula = MathTex(
            r"x = \frac{-5 \pm \sqrt{49}}{4}",
            font_size=40,
            color=YELLOW
        )
        simplified_formula.next_to(step3, DOWN, buff=0.8)
        self.play(Write(simplified_formula))
        self.wait(1)
        
        # Calculate square root
        sqrt_calc = MathTex(r"\sqrt{49} = 7", font_size=36, color=GREEN)
        sqrt_calc.next_to(simplified_formula, DOWN, buff=0.5)
        self.play(Write(sqrt_calc))
        self.wait(1)
        
        # Final simplified formula
        final_formula = MathTex(
            r"x = \frac{-5 \pm 7}{4}",
            font_size=40,
            color=YELLOW
        )
        final_formula.next_to(sqrt_calc, DOWN, buff=0.5)
        self.play(Write(final_formula))
        self.wait(2)
        
        # Clear screen for solutions
        self.play(FadeOut(VGroup(disc_title, step1, step2, step3, simplified_formula, sqrt_calc, substituted_formula)))
        
        solutions_title = Text("Two Solutions:", font_size=36)
        solutions_title.next_to(title, DOWN, buff=0.8)
        self.play(Write(solutions_title))
        
        # Solution 1
        sol1_calc = MathTex(
            r"x_1 = \frac{-5 + 7}{4} = \frac{2}{4} = \frac{1}{2}",
            font_size=36,
            color=GREEN
        )
        sol1_calc.next_to(solutions_title, DOWN, buff=0.8)
        self.play(Write(sol1_calc))
        self.wait(1)
        
        # Solution 2
        sol2_calc = MathTex(
            r"x_2 = \frac{-5 - 7}{4} = \frac{-12}{4} = -3",
            font_size=36,
            color=GREEN
        )
        sol2_calc.next_to(sol1_calc, DOWN, buff=0.5)
        self.play(Write(sol2_calc))
        self.wait(2)
        
        # Final answer display
        final_answer = MathTex(
            r"x = \frac{1}{2} \text{ and } x = -3",
            font_size=48,
            color=BLUE
        )
        final_answer.next_to(sol2_calc, DOWN, buff=1)
        
        # Create a box around the final answer
        answer_box = SurroundingRectangle(final_answer, color=BLUE, buff=0.3)
        
        self.play(Write(final_answer))
        self.play(Create(answer_box))
        self.wait(3)
        
        # Keep final formula visible
        self.play(FadeOut(VGroup(final_formula)))
        self.wait(2)