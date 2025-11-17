from manim import *

class PositiveIntegersMultiplication(Scene):
    def construct(self):
        # Display the problem
        problem = MathTex("3 \\times 4", font_size=48)
        problem.to_edge(UP)
        self.play(Write(problem))
        self.wait(1)
        
        # Display interpretation
        interpretation = Text("4 jumps, each of size 3, starting from 0", font_size=24)
        interpretation.next_to(problem, DOWN, buff=0.5)
        self.play(Write(interpretation))
        self.wait(2)
        
        # Create number line
        number_line = NumberLine(
            x_range=[0, 15, 1],
            length=12,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        number_line.shift(DOWN * 2)
        self.play(Create(number_line))
        self.wait(1)
        
        # Create a pointer/dot to show current position
        pointer = Dot(color=RED, radius=0.1)
        pointer.move_to(number_line.number_to_point(0))
        self.play(Create(pointer))
        
        # Position label for current position
        position_label = Text("Position: 0", font_size=20, color=RED)
        position_label.next_to(pointer, UP, buff=0.3)
        self.play(Write(position_label))
        self.wait(1)
        
        # First jump from 0 to 3
        jump1_label = Text("Jump 1: +3", font_size=20, color=BLUE)
        jump1_label.to_edge(LEFT, buff=1).shift(DOWN * 0.5)
        self.play(Write(jump1_label))
        
        # Create arrow for first jump
        arrow1 = Arrow(
            start=number_line.number_to_point(0),
            end=number_line.number_to_point(3),
            color=BLUE,
            buff=0
        )
        arrow1.shift(UP * 0.3)
        self.play(Create(arrow1))
        
        # Animate pointer moving to position 3
        self.play(
            pointer.animate.move_to(number_line.number_to_point(3)),
            Transform(position_label, Text("Position: 3", font_size=20, color=RED).next_to(number_line.number_to_point(3), UP, buff=0.5))
        )
        self.wait(1)
        
        # Second jump from 3 to 6
        jump2_label = Text("Jump 2: +3", font_size=20, color=GREEN)
        jump2_label.next_to(jump1_label, DOWN, buff=0.2)
        self.play(Write(jump2_label))
        
        # Create arrow for second jump
        arrow2 = Arrow(
            start=number_line.number_to_point(3),
            end=number_line.number_to_point(6),
            color=GREEN,
            buff=0
        )
        arrow2.shift(UP * 0.3)
        self.play(Create(arrow2))
        
        # Animate pointer moving to position 6
        self.play(
            pointer.animate.move_to(number_line.number_to_point(6)),
            Transform(position_label, Text("Position: 6", font_size=20, color=RED).next_to(number_line.number_to_point(6), UP, buff=0.5))
        )
        self.wait(1)
        
        # Third jump from 6 to 9
        jump3_label = Text("Jump 3: +3", font_size=20, color=YELLOW)
        jump3_label.next_to(jump2_label, DOWN, buff=0.2)
        self.play(Write(jump3_label))
        
        # Create arrow for third jump
        arrow3 = Arrow(
            start=number_line.number_to_point(6),
            end=number_line.number_to_point(9),
            color=YELLOW,
            buff=0
        )
        arrow3.shift(UP * 0.3)
        self.play(Create(arrow3))
        
        # Animate pointer moving to position 9
        self.play(
            pointer.animate.move_to(number_line.number_to_point(9)),
            Transform(position_label, Text("Position: 9", font_size=20, color=RED).next_to(number_line.number_to_point(9), UP, buff=0.5))
        )
        self.wait(1)
        
        # Fourth jump from 9 to 12
        jump4_label = Text("Jump 4: +3", font_size=20, color=ORANGE)
        jump4_label.next_to(jump3_label, DOWN, buff=0.2)
        self.play(Write(jump4_label))
        
        # Create arrow for fourth jump
        arrow4 = Arrow(
            start=number_line.number_to_point(9),
            end=number_line.number_to_point(12),
            color=ORANGE,
            buff=0
        )
        arrow4.shift(UP * 0.3)
        self.play(Create(arrow4))
        
        # Animate pointer moving to position 12
        self.play(
            pointer.animate.move_to(number_line.number_to_point(12)),
            Transform(position_label, Text("Position: 12", font_size=20, color=RED).next_to(number_line.number_to_point(12), UP, buff=0.5))
        )
        self.wait(1)
        
        # Show final result
        result = MathTex("3 \\times 4 = 12", font_size=48, color=GREEN)
        result.to_edge(DOWN, buff=1)
        self.play(Write(result))
        self.wait(3)