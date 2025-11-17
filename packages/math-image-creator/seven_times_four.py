from manim import *

class SevenTimesFour(Scene):
    def construct(self):
        # Title
        title = Text("Multiplication: 7 × 4", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)
        
        # Create the multiplication equation
        equation = MathTex("7", "\\times", "4", "=", "?")
        equation.scale(1.5)
        equation.shift(UP * 0.5)
        
        # Animate writing the equation
        self.play(Write(equation[0:3]))  # Write "7 × 4"
        self.wait(0.5)
        self.play(Write(equation[3:5]))  # Write "= ?"
        self.wait(1)
        
        # Visual representation of 7 × 4 using dots arranged in a grid
        dots_group = VGroup()
        colors = [BLUE, GREEN, YELLOW, RED, ORANGE, PURPLE, PINK]
        
        # Create 7 rows of 4 dots each
        for i in range(7):
            row = VGroup()
            for j in range(4):
                dot = Dot(radius=0.12, color=colors[i])
                dot.move_to(LEFT * 1.5 + RIGHT * j * 0.8 + DOWN * (1.5 + i * 0.4))
                row.add(dot)
            dots_group.add(row)
        
        # Animate dots appearing row by row
        for i, row in enumerate(dots_group):
            self.play(
                FadeIn(row),
                run_time=0.4
            )
        
        self.wait(0.5)
        
        # Add labels for counting
        count_label = Text("Counting: ", font_size=24)
        count_label.shift(DOWN * 4)
        self.play(Write(count_label))
        
        # Count all dots with animation
        counter = ValueTracker(0)
        count_number = always_redraw(
            lambda: DecimalNumber(
                counter.get_value(),
                num_decimal_places=0,
                font_size=24
            ).next_to(count_label, RIGHT)
        )
        
        self.add(count_number)
        
        # Animate counting from 0 to 28
        self.play(
            counter.animate.set_value(28),
            run_time=3,
            rate_func=linear
        )
        
        self.wait(0.5)
        
        # Replace the question mark with the answer
        answer = MathTex("28")
        answer.scale(1.5)
        answer.move_to(equation[4].get_center())
        answer.set_color(GREEN)
        
        self.play(
            ReplacementTransform(equation[4], answer),
            run_time=1
        )
        
        # Highlight the complete equation
        final_equation = MathTex("7", "\\times", "4", "=", "28")
        final_equation.scale(1.5)
        final_equation.shift(UP * 0.5)
        final_equation[4].set_color(GREEN)
        
        self.play(
            Transform(equation[0:4], final_equation[0:4]),
            run_time=0.5
        )
        
        # Create a box around the answer
        answer_box = SurroundingRectangle(answer, color=GREEN, buff=0.2)
        self.play(Create(answer_box))
        
        self.wait(1)
        
        # Show alternative calculation method - repeated addition
        alt_text = Text("Alternative: 7 + 7 + 7 + 7", font_size=24)
        alt_text.shift(DOWN * 4.5)
        self.play(Write(alt_text))
        
        # Show step by step addition
        addition_steps = [
            MathTex("7"),
            MathTex("7 + 7 = 14"),
            MathTex("14 + 7 = 21"), 
            MathTex("21 + 7 = 28")
        ]
        
        for i, step in enumerate(addition_steps):
            step.shift(DOWN * 5.5)
            step.scale(0.8)
            if i == 0:
                self.play(Write(step))
            else:
                self.play(Transform(addition_steps[i-1], step))
            self.wait(0.8)
        
        self.wait(1)
        
        # Final message
        conclusion = Text("7 × 4 = 28", font_size=36, color=YELLOW)
        conclusion.shift(DOWN * 3.5)
        self.play(
            FadeOut(count_label),
            FadeOut(count_number),
            FadeOut(alt_text),
            FadeOut(addition_steps[-1]),
            Write(conclusion)
        )
        
        self.wait(2)