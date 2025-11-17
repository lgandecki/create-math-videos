from manim import *

class AdditionOnNumberLineDemo(Scene):
    def construct(self):
        # Create the number line
        number_line = NumberLine(
            x_range=[0, 8, 1],
            length=12,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=32
        )
        number_line.move_to(ORIGIN)
        
        # Present the addition problem
        equation = Text("3 + 2", font_size=48, color=WHITE)
        equation.to_edge(UP)
        
        # Create the blue dot
        dot = Dot(color=BLUE, radius=0.1)
        dot.move_to(number_line.number_to_point(3))
        
        # Text elements
        start_text = Text("Start at the first number (3)", font_size=28, color=WHITE)
        start_text.to_edge(DOWN)
        
        steps_text = Text("The second number (2) tells us how many steps to take", font_size=28, color=WHITE)
        steps_text.to_edge(DOWN)
        
        result_text = Text("The number where you land is the sum!", font_size=28, color=WHITE)
        result_text.to_edge(DOWN)
        
        final_equation = Text("3 + 2 = 5", font_size=48, color=WHITE)
        final_equation.to_edge(UP)
        
        # Animation sequence
        # 1. Show number line and equation
        self.play(Create(number_line))
        self.play(Write(equation))
        self.wait(1)
        
        # 2. Place dot at starting position (3)
        self.play(FadeIn(dot))
        self.play(Write(start_text))
        self.wait(2)
        
        # 3. Show steps explanation
        self.play(Transform(start_text, steps_text))
        self.wait(1)
        
        # 4. First jump: 3 to 4
        arrow1 = Arrow(
            start=number_line.number_to_point(3) + UP * 0.5,
            end=number_line.number_to_point(4) + UP * 0.5,
            color=GREEN,
            buff=0
        )
        
        self.play(Create(arrow1))
        self.play(dot.animate.move_to(number_line.number_to_point(4)), run_time=1)
        self.wait(1)
        
        # 5. Second jump: 4 to 5
        arrow2 = Arrow(
            start=number_line.number_to_point(4) + UP * 0.5,
            end=number_line.number_to_point(5) + UP * 0.5,
            color=GREEN,
            buff=0
        )
        
        self.play(Create(arrow2))
        self.play(dot.animate.move_to(number_line.number_to_point(5)), run_time=1)
        self.wait(1)
        
        # 6. Emphasize the final position
        dot_emphasis = dot.copy().set_color(YELLOW).scale(1.5)
        self.play(Transform(dot, dot_emphasis))
        self.wait(0.5)
        
        # 7. Show result text
        self.play(Transform(start_text, result_text))
        self.wait(2)
        
        # 8. Complete the equation
        self.play(Transform(equation, final_equation))
        self.wait(2)
        
        # Final pause
        self.wait(1)