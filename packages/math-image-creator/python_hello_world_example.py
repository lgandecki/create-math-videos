from manim import *

class PythonHelloWorldExample(Scene):
    def construct(self):
        # Create title
        title = Text("A Python Example", font_size=48, color=BLUE)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title))
        self.wait(1)
        
        # Create code editor interface
        editor_bg = Rectangle(
            width=10, height=4.5,
            fill_color=BLACK, fill_opacity=0.9,
            stroke_color=GRAY, stroke_width=2
        )
        editor_bg.shift(UP * 0.5)
        
        # Editor header
        header = Rectangle(
            width=10, height=0.6,
            fill_color=DARK_GRAY, fill_opacity=1,
            stroke_color=GRAY, stroke_width=2
        )
        header.next_to(editor_bg.get_top(), DOWN, buff=0)
        
        header_text = Text("Python Editor", font_size=20, color=WHITE)
        header_text.move_to(header.get_center())
        
        self.play(
            FadeIn(editor_bg),
            FadeIn(header),
            Write(header_text)
        )
        self.wait(0.5)
        
        # Line numbers
        line_num_1 = Text("1", font_size=16, color=GRAY, font="Courier New")
        line_num_2 = Text("2", font_size=16, color=GRAY, font="Courier New")
        
        line_num_1.move_to(editor_bg.get_left() + RIGHT * 0.5 + UP * 1.2)
        line_num_2.move_to(editor_bg.get_left() + RIGHT * 0.5 + UP * 0.2)
        
        self.play(Write(line_num_1))
        
        # Animate typing the first line of code
        code_line_1 = Text('print("Hello World!")', font_size=20, color=WHITE, font="Courier New")
        code_line_1.next_to(line_num_1, RIGHT, buff=0.3)
        
        # Type character by character
        typed_text = ""
        full_code = 'print("Hello World!")'
        
        for i, char in enumerate(full_code):
            typed_text += char
            current_text = Text(typed_text, font_size=20, color=WHITE, font="Courier New")
            current_text.next_to(line_num_1, RIGHT, buff=0.3)
            
            if i == 0:
                self.play(Write(current_text), run_time=0.1)
            else:
                self.play(Transform(code_line_1, current_text), run_time=0.1)
                code_line_1 = current_text
        
        self.wait(1)
        
        # Highlight the print() function
        print_highlight = SurroundingRectangle(
            code_line_1[0:5],  # "print"
            color=YELLOW, buff=0.05
        )
        print_label = Text("Function/Command", font_size=16, color=YELLOW)
        print_label.next_to(print_highlight, UP, buff=0.2)
        
        self.play(
            Create(print_highlight),
            Write(print_label)
        )
        self.wait(2)
        
        # Remove print highlight and add string highlight
        self.play(
            FadeOut(print_highlight),
            FadeOut(print_label)
        )
        
        # Highlight the string
        string_highlight = SurroundingRectangle(
            code_line_1[6:19],  # "Hello World!"
            color=GREEN, buff=0.05
        )
        string_label = Text("String/Text", font_size=16, color=GREEN)
        string_label.next_to(string_highlight, UP, buff=0.2)
        
        self.play(
            Create(string_highlight),
            Write(string_label)
        )
        self.wait(2)
        
        self.play(
            FadeOut(string_highlight),
            FadeOut(string_label)
        )
        
        # Create and animate Run button
        run_button = RoundedRectangle(
            width=1.5, height=0.6,
            corner_radius=0.1,
            fill_color=GREEN, fill_opacity=0.8,
            stroke_color=WHITE, stroke_width=2
        )
        run_button.next_to(editor_bg, DOWN, buff=0.3)
        
        run_text = Text("Run", font_size=18, color=WHITE, weight=BOLD)
        run_text.move_to(run_button.get_center())
        
        self.play(
            FadeIn(run_button),
            Write(run_text)
        )
        
        # Animate button press
        self.play(
            run_button.animate.scale(0.95),
            run_time=0.2
        )
        self.play(
            run_button.animate.scale(1.05),
            run_time=0.2
        )
        
        self.wait(0.5)
        
        # Create console window
        console_bg = Rectangle(
            width=10, height=2,
            fill_color=BLACK, fill_opacity=0.95,
            stroke_color=WHITE, stroke_width=2
        )
        console_bg.next_to(run_button, DOWN, buff=0.5)
        
        console_header = Rectangle(
            width=10, height=0.4,
            fill_color=DARK_BLUE, fill_opacity=1,
            stroke_color=WHITE, stroke_width=2
        )
        console_header.next_to(console_bg.get_top(), DOWN, buff=0)
        
        console_title = Text("Console Output", font_size=16, color=WHITE)
        console_title.move_to(console_header.get_center())
        
        self.play(
            FadeIn(console_bg),
            FadeIn(console_header),
            Write(console_title)
        )
        
        # Animate output appearing
        output_text = Text("Hello World!", font_size=18, color=GREEN, font="Courier New")
        output_text.move_to(console_bg.get_center() + UP * 0.2)
        
        self.play(Write(output_text), run_time=1)
        self.wait(2)
        
        # Second example
        self.play(Write(line_num_2))
        
        # Type second line of code
        code_line_2 = Text('print("Hello Manim!")', font_size=20, color=WHITE, font="Courier New")
        code_line_2.next_to(line_num_2, RIGHT, buff=0.3)
        
        typed_text_2 = ""
        full_code_2 = 'print("Hello Manim!")'
        
        for i, char in enumerate(full_code_2):
            typed_text_2 += char
            current_text_2 = Text(typed_text_2, font_size=20, color=WHITE, font="Courier New")
            current_text_2.next_to(line_num_2, RIGHT, buff=0.3)
            
            if i == 0:
                self.play(Write(current_text_2), run_time=0.1)
            else:
                self.play(Transform(code_line_2, current_text_2), run_time=0.1)
                code_line_2 = current_text_2
        
        self.wait(1)
        
        # Run button press animation for second example
        self.play(
            run_button.animate.scale(0.95),
            run_time=0.2
        )
        self.play(
            run_button.animate.scale(1.05),
            run_time=0.2
        )
        
        # Second output
        output_text_2 = Text("Hello Manim!", font_size=18, color=GREEN, font="Courier New")
        output_text_2.move_to(console_bg.get_center() + DOWN * 0.3)
        
        self.play(Write(output_text_2), run_time=1)
        self.wait(3)
        
        # Final message
        final_message = Text("This shows the basic pattern of Python programming!", 
                           font_size=24, color=BLUE)
        final_message.next_to(console_bg, DOWN, buff=0.5)
        
        self.play(Write(final_message))
        self.wait(3)