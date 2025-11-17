from manim import *

class NumberLineUnderstanding(Scene):
    def construct(self):
        # Create title
        title = Text("Understanding the Number Line", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        # Create number line from 0 to 10
        number_line = NumberLine(
            x_range=[0, 10, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=36
        )
        number_line.center()
        
        # Create arrow to show direction
        arrow = Arrow(
            start=number_line.n2p(0) + UP * 0.8,
            end=number_line.n2p(10) + UP * 0.8,
            color=GREEN,
            stroke_width=6
        )
        
        # Text explaining direction
        direction_text = Text(
            "Numbers increase as you move to the right",
            font_size=32,
            color=GREEN
        )
        direction_text.next_to(arrow, UP, buff=0.3)
        
        # Addition explanation
        addition_text = Text(
            "For addition, we always move to the right",
            font_size=32,
            color=YELLOW
        )
        addition_text.to_edge(DOWN, buff=1.5)
        
        # Starting point explanation
        start_text = Text(
            "Start at the first number in an addition problem",
            font_size=28,
            color=RED
        )
        start_text.to_edge(DOWN, buff=0.5)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        # Animate number line appearing
        self.play(Create(number_line))
        self.wait(1)
        
        # Show direction arrow and explanation
        self.play(Create(arrow))
        self.play(Write(direction_text))
        self.wait(2)
        
        # Highlight some numbers to show increasing pattern
        for i in range(0, 11, 2):
            dot = Dot(number_line.n2p(i), color=BLUE, radius=0.1)
            self.play(Create(dot), run_time=0.3)
        self.wait(1)
        
        # Remove dots
        self.play(FadeOut(*[mob for mob in self.mobjects if isinstance(mob, Dot)]))
        
        # Show addition explanation
        self.play(Write(addition_text))
        self.wait(2)
        
        # Show starting point explanation
        self.play(Write(start_text))
        self.wait(2)
        
        # Demonstrate with example: start at 3, add 2
        start_dot = Dot(number_line.n2p(3), color=RED, radius=0.15)
        start_label = Text("Start here: 3", font_size=24, color=RED)
        start_label.next_to(start_dot, UP, buff=0.5)
        
        self.play(Create(start_dot), Write(start_label))
        self.wait(1)
        
        # Show movement to the right for addition
        movement_arrow = Arrow(
            start=number_line.n2p(3) + DOWN * 0.5,
            end=number_line.n2p(5) + DOWN * 0.5,
            color=YELLOW,
            stroke_width=4
        )
        movement_label = Text("Move 2 spaces right", font_size=24, color=YELLOW)
        movement_label.next_to(movement_arrow, DOWN, buff=0.2)
        
        self.play(Create(movement_arrow), Write(movement_label))
        self.wait(1)
        
        # Show final position
        end_dot = Dot(number_line.n2p(5), color=GREEN, radius=0.15)
        end_label = Text("End here: 5", font_size=24, color=GREEN)
        end_label.next_to(end_dot, UP, buff=0.5)
        
        self.play(Create(end_dot), Write(end_label))
        self.wait(1)
        
        # Show the complete equation
        equation = MathTex("3 + 2 = 5", font_size=48, color=WHITE)
        equation.to_edge(DOWN, buff=0.1)
        
        self.play(Write(equation))
        self.wait(3)
        
        # Final pause
        self.wait(2)