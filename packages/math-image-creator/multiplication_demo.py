from manim import *

class MultiplicationDemo(Scene):
    def construct(self):
        # Title
        title = Text("Multiplication: 4 × 2", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)
        
        # Create the multiplication equation
        equation = MathTex("4", "\\times", "2", "=", "?")
        equation.scale(1.5)
        equation.shift(UP * 0.5)
        
        # Animate writing the equation
        self.play(Write(equation[0:3]))  # Write "4 × 2"
        self.wait(0.5)
        self.play(Write(equation[3:5]))  # Write "= ?"
        self.wait(1)
        
        # Visual representation of 4 × 2 using dots
        dots_group = VGroup()
        colors = [BLUE, GREEN, YELLOW, RED]
        
        # Create 4 groups of 2 dots each
        for i in range(4):
            group = VGroup()
            for j in range(2):
                dot = Dot(radius=0.15, color=colors[i])
                dot.move_to(LEFT * 2 + RIGHT * i * 1.2 + DOWN * (1.5 + j * 0.5))
                group.add(dot)
            dots_group.add(group)
        
        # Animate dots appearing group by group
        for i, group in enumerate(dots_group):
            self.play(
                FadeIn(group),
                run_time=0.5
            )
        
        self.wait(0.5)
        
        # Add labels for counting
        count_label = Text("Counting: ", font_size=24)
        count_label.shift(DOWN * 3)
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
        
        # Animate counting from 0 to 8
        self.play(
            counter.animate.set_value(8),
            run_time=2,
            rate_func=linear
        )
        
        self.wait(0.5)
        
        # Replace the question mark with the answer
        answer = MathTex("8")
        answer.scale(1.5)
        answer.move_to(equation[4].get_center())
        answer.set_color(GREEN)
        
        self.play(
            ReplacementTransform(equation[4], answer),
            run_time=1
        )
        
        # Highlight the complete equation
        final_equation = MathTex("4", "\\times", "2", "=", "8")
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
        
        self.wait(2)
        
        # Final message
        conclusion = Text("4 × 2 = 8", font_size=36, color=YELLOW)
        conclusion.shift(DOWN * 3.5)
        self.play(
            FadeOut(count_label),
            FadeOut(count_number),
            Write(conclusion)
        )
        
        self.wait(2)